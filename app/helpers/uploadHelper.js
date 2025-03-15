/**
 * NextBoard - A Modern Bulletin Board System
 * "Where discussions take the next step."
 * 
 * Author: Sam Wilcox
 * Email: sam@nextboard.org
 * Website: https://www.nextboard.org
 * GitHub: https://github.com/samwilcox/nextboard
 * 
 * License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * For full license details, visit: https://license.nextboard.org
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const multer = require('multer');
const Settings = require('../settings');
const LocaleHelper = require('./localeHelper');
const FileHelper = require('./fileHelper');
const MemberService = require('../services/memberService');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require('./dateTimeHelper');
const OutputHelper = require('./outputHelper');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: Settings.get('singleFileUploadSizeLimit') },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = Settings.get('allowedFileExtensions');
        const fileExtension = path.extname(file.originalname).split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error(LocaleHelper.replaceAll('errors', 'invalidFileType', { type: fileExtension, allowedTypes: allowedExtensions })));
        }

        cb(null, true);
    }
});

/**
 * UploadHelper helper that manages file uploads.
 */
class UploadHelper {
    /**
     * Uploads a file.
     * 
     * @param {Object} file - The file to upload. 
     * @param {string} uploaderId - The uploader identifier.
     * @param {"attachment"|"photo"|"cover"} [uploadType='attachment'] - The upload type (e.g., 'attachment').
     * @returns {Promise<Object>} A promise that resolves to an object with the results and info of the file upload.
     */
    static async uploadFile(file, uploaderId, uploadType = 'attachment') {
        if (!file) {
            return { success: false, message: LocaleHelper.get('errors', 'noFileProvided') };
        }

        const member = MemberService.getMember();
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const validation = this.validateFile(file, { checkDiskQuota: uploadType === 'attachment' });
        
        if (!validation.success) {
            return validation;
        }

        const uploadPath = this.getUploadPath(uploadType, member);
        const fileName = this.getUniqueFileName(file.originalname, uploadPath);
        
        if (!uploadPath) {
            return { success: false, message: LocaleHelper.replace('errors', 'invalidUploadType', 'type', uploadType) };
        }

        if (!fs.existsSync(uploadPath)) {
            FileHelper.createDirectoryIfNotExists(uploadPath);
        }

        const filePath = path.join(uploadPath, fileName);
        let fileId;
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        
        try {
            this.saveFile(file.buffer, filePath);

            if (uploadType === 'photo' || uploadType === 'cover') {
                FileHelper.deleteDirectoryContents(baseUploadPath);
            }

            fileId = await this.insertFileRecord(uploadType, member, fileName, file.size, db, builder, cache);

            const isPhoto = this.isPhoto(file);

            const preview = isPhoto
                ? OutputHelper.getPartial('uploadHelper', 'photo-preview', { url: this.getPhotoUrl(fileName, uploadType), fileName, fileSize: FileHelper.formatFileSize(file.size), type: uploadType, id: fileId, uploaderId })
                : OutputHelper.getPartial('uploadHelper', 'file-preview', { fileName, fileSize: FileHelper.formatFileSize(file.size), type: uploadType, id: fileId, uploaderId });
        
            return { success: true, message: LocaleHelper.get('uploadHelper', 'uploadSuccessful'), url: this.getPhotoUrl(fileName, uploadType), size: FileHelper.formatFileSize(file.size), fileExtension, preview, type: uploadType, id: fileId };
        } catch (error) {
            return { success: false, message: LocaleHelper.replace('errors', 'errorSavingFile', 'error', error) };
        }
    }

    /**
     * Inserts a file record into the database.
     * 
     * @param {"attachment"|"photo"|"cover"} [uploadType='attachment'] - The upload type (e.g., 'attachment').
     * @param {Member} member - The member entity. 
     * @param {string} fileName - The name of the file. 
     * @param {number} fileSize - The size of the file. 
     * @param {DatabaseProviderFactory} db - The database provider factory instance. 
     * @param {QueryBuilder} builder - The database query builder instance. 
     * @param {CacheProviderFactory} cache - The cache provider factory instance. 
     * @returns {number} The resulting file identifier.
     */
    static async insertFileRecord(uploadType, member, fileName, fileSize, db, builder, cache) {
        let fileId;

        switch (uploadType) {
            case 'attachment':
                const attachmentResult = await db.query(builder
                    .clear()
                    .insertInto('member_attachments', [
                        'memberId', 'fileName', 'fileSize', 'uploadedAt'
                    ], [
                        member.getId(), fileName, fileSize, DateTimeHelper.dateToEpoch(new Date())])
                    .build()
                );

                fileId = attachmentResult.insertId;
                await cache.update('member_attachments');
                break;
            case 'photo':
                fileId = await this.handleProfilePhotoUpload(member, fileName, fileSize, db, builder, cache);
                break;
            case 'cover':
                fileId = await this.handleCoverPhotoUpload(member, fileName, fileSize, db, builder, cache);
                break;
        }

        return fileId;
    }

    /**
     * Handles profile photo uploads.
     * 
     * @param {Member} member - The member entity. 
     * @param {string} fileName - The name of the file. 
     * @param {number} fileSize - The size of the file. 
     * @param {DatabaseProviderFactory} db - The database provider factory instance. 
     * @param {QueryBuilder} builder - The database query builder instance. 
     * @param {CacheProviderFactory} cache - The cache provider factory instance. 
     * @returns {number} The resulting file identifier.
     */
    static async handleProfilePhotoUpload(member, fileName, fileSize, db, builder, cache) {
        if (member.getPhotoType() === 'uploaded' && member.getPhotoId() > 0) {
            await db.query(builder
                .clear()
                .update('member_photos')
                .set([
                    'fileName', 'fileSize', 'uploadedAt'
                ], [
                    fileName, fileSize, DateTimeHelper.dateToEpoch(new Date())
                ])
                .where('id = ?', [member.getPhotoId()])
                .build()
            );

            await cache.update('member_photos');
            return member.getPhotoId();
        }

        const result = await db.query(builder
            .clear()
            .insertInto('member_photos', [
                'fileName', 'fileSize', 'uploadedAt'
            ], [
                fileName, fileSize, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        const photoId = result.insertid;

        await db.query(builder
            .clear()
            .update('members')
            .set(['photoType', 'photoId'], ['uploaded', photoId])
            .where('id = ?', [member.getId()])
            .build()
        );

        await cache.updateAll(['members', 'member_photos']);

        return photoId;
    }

    /**
     * Handles cover photo uploads.
     * 
     * @param {Member} member - The member entity. 
     * @param {string} fileName - The name of the file. 
     * @param {number} fileSize - The size of the file. 
     * @param {DatabaseProviderFactory} db - The database provider factory instance. 
     * @param {QueryBuilder} builder - The database query builder instance. 
     * @param {CacheProviderFactory} cache - The cache provider factory instance. 
     * @returns {number} The resulting file identifier.
     */
    static async handleCoverPhotoUpload(member, fileName, fileSize, db, builder, cache) {
        if (member.getCoverPhotoType() === 'uploaded' && member.getCoverPhotoId() > 0) {
            await db.query(builder
                .clear()
                .update('member_cover_photos')
                .set([
                    'fileName', 'fileSize', 'uploadedAt'
                ], [
                    fileName, fileSize, DateTimeHelper.dateToEpoch(new Date())
                ])
                .where('id = ?', [member.getCoverPhotoId()])
                .build()
            );

            await cache.update('member_cover_photos');
            return member.getCoverPhotoId();
        }

        const result = await db.query(builder
            .clear()
            .insertInto('member_cover_photos', [
                'fileName', 'fileSize', 'uploadedAt'
            ], [
                fileName, fileSize, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        const coverPhotoId = result.insertId;

        await db.query(builder
            .clear()
            .update('members')
            .set(['coverPhotoType', 'coverPhotoId'], ['uploaded', coverPhotoId])
            .where('id = ?', [member.getId()])
            .build()
        );

        await cache.updateAll(['members', 'member_cover_photos']);

        return coverPhotoId;
    }

    /**
     * Validates the file against size, extension, and disk quota.
     * 
     * @param {Object} file - The file to upload.
     * @param {Object} [options={}] - Options for validating the file.
     * @param {boolean} [options.checkDiskQuota=false] - True to check the member's disk quota, false not to.
     * @returns {Object} Validation result with status and message. 
     */
    static validateFile(file, options = {}) {
        const { checkDiskQuota = false } = options;
        const member = MemberService.getMember();
        const maxFileSize = Settings.get('singleFileUploadSizeLimit');

        if (file.size > maxFileSize) {
            return { success: false, message: LocaleHelper.replace('errors', 'fileExceedsSizeLimit', 'limit', FileHelper.formatFileSize(maxFileSize)) };
        }

        if (checkDiskQuota) {
            const currentDiskUsage = member.getCurrentDiskUsage();
            const maxQuota = Settings.get('memberDiskQuota');

            if (currentDiskUsage + file.size > maxQuota) {
                return { success: false, message: LocaleHelper.replaceAll('errors', 'exceedsDiskQuota', { size: FileHelper.formatFileSize(file.size), quota: FileHelper.formatFileSize(maxQuota) })};
            }
        }

        return { success: true };
    }

    /**
     * Get the correct upload path for the given upload type.
     * 
     * @param {"attachment"|"photo"|"cover"} [uploadType='attachment'] - The upload type (e.g., 'attachment').
     * @param {Member} member - The member entity. 
     */
    static getUploadPath(uploadType, member) {
        const uploadsDir = path.join(__dirname, '..', '..', 'public', Settings.get('uploadsDir'));

        switch (uploadType) {
            case 'attachment':
                return path.join(uploadsDir, Settings.get('attachmentsDir'), `member-${member.getId()}`);
            case 'photo':
                return path.join(uploadsDir, Settings.get('profilePhotosDir'), `member-${member.getId()}`);
            case 'cover':
                return path.join(uploadsDir, Settings.get('coverPhotoDir'), `member-${member.getId()}`);
            default:
                return null;
        }
    }

    /**
     * Get the URL to the given photo.
     * 
     * @param {string} fileName - The name of the file.
     * @param {"attachment"|"photo"|"cover"} [uploadType='attachment'] - The upload type (e.g., 'attachment').
     * @returns {string|null} The URL address to the given photo or null if an invalid upload type.
     */
    static getPhotoUrl(fileName, uploadType = 'attachment') {
        const member = MemberService.getMember();
        const uploadsDir = Settings.get('uploadsDir');
        let baseUrl = `${process.env.BASE_URL}/${uploadsDir}`;

        switch (uploadType) {
            case 'attachment':
                const attachmentsDir = Settings.get('attachmentsDir');
                return `${baseUrl}/${attachmentsDir}/member-${member.getId()}/${fileName}`;
            case 'photo':
                const photosDir = Settings.get('profilePhotosDir');
                return `${baseUrl}/${photosDir}/member-${member.getId()}/${fileName}`;
            case 'cover':
                const coverPhotosDir = Settings.get('coverPhotosDir');
                return `${baseUrl}/${coverPhotosDir}/member-${member.getId()}/${fileName}`;
            default:
                return null;
        }
    }

    /**
     * Saves the file to disk.
     * 
     * @param {Buffer} buffer - The file buffer. 
     * @param {string} filePath - The destination file path. 
     */
    static saveFile(buffer, filePath) {
        fs.writeFileSync(filePath, buffer);
    }
    
    /**
     * Checks if a file is a photo based on its extension.
     * 
     * @param {Object} file - The file to check.
     * @returns {Object} An object indicating if it's a photo and its URL.
     */
    static isPhoto(file) {
        return mime.lookup(file.originalname)?.startsWith('image/');
    }

    /**
     * Recursively checks if a file name exists and generates a new name if neccessary.
     * 
     * @param {string} originalName - The original file name (e.g., image.png).
     * @param {string} uploadPath - The path to where the file is being uploaded.
     * @param {number} counter - The counter for recursion.
     * @returns {string} An unique file name.
     */
    static getUniqueFileName(originalName, uploadPath, counter = 0) {
        const extname = path.extname(originalName);
        const basename = path.basename(originalName, extname);
        let newFileName = originalName;

        if (counter > 0) {
            newFileName = `${basename}(${counter})${extname}`;
        }

        const filePath = path.join(uploadPath, newFileName);

        try {
            fs.access(filePath);
            return this.getUniqueFileName(originalName, uploadPath, counter + 1);
        } catch (error) {
            return newFileName;
        }
    }
}

module.exports = {
    UploadHelper,
    upload,
};