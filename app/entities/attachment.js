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

const FileHelper = require("../helpers/fileHelper");
const LocaleHelper = require("../helpers/localeHelper");
const OutputHelper = require("../helpers/outputHelper");
const UtilHelper = require("../helpers/utilHelper");

/**
 * An entity that represents a single attachment.
 */
class Attachment {
    /**
     * Creates a new instance of Attachment.
     */
    constructor() {
        this.id = null;
        this.memberId = null;
        this.fileName = null;
        this.fileSize = null;
        this.uploadedAt = null;
        this.totalDownlaods = null;
        this.forumId = null;
    }

    /**
     * Get the attachment identifier.
     * 
     * @returns {number} The attachment identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the attachment identifier.
     * 
     * @param {number} id - The attachment identifier. 
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the member identifier.
     * 
     * @returns {number} The member identifier.
     */
    getMemberId() {
        return this.memberId;
    }

    /**
     * Set the member identifier.
     * 
     * @param {number} memberId - The member identifier.
     */
    setMemberId(memberId) {
        this.memberId = memberId;
    }

    /**
     * Get the name of the file.
     * 
     * @returns {string} The name of the file.
     */
    getFileName() {
        return this.fileName;
    }

    /**
     * Set the name of the file.
     * 
     * @param {string} fileName - The name of the file. 
     */
    setFileName(fileName) {
        this.fileName = fileName;
    }

    /**
     * Get the file size in bytes.
     * 
     * @returns {number} The file size in bytes.
     */
    getFileSize() {
        return this.fileSize;
    }

    /**
     * Set the file size in bytes.
     * 
     * @param {number} fileSize - The file size in bytes.
     */
    setFileSize(fileSize) {
        this.fileSize = fileSize;
    }

    /**
     * Get the Date object of when the attachment was uploaded.
     * 
     * @returns {Date} The Date object for when the attachment was uploaded.
     */
    getUploadedAt() {
        return this.uploadedAt;
    }

    /**
     * Set the Date object of when the attachment was uploaded.
     * 
     * @param {Date} uploadedAt - The Date object for when the attachment was uploaded.
     */
    setUploadedAt(uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    /**
     * Get the total downloads for this attachment.
     * 
     * @returns {number} The total downloads for this attachment.
     */
    getTotalDownloads() {
        return this.totalDownlaods;
    }

    /**
     * Set the total downloads for this attachment.
     * 
     * @param {number} totalDownlaods - The total downloads for this attachment.
     */
    setTotalDownloads(totalDownlaods) {
        this.totalDownlaods = totalDownlaods;
    }

    /**
     * Get the forum identifier.
     * 
     * @returns {number} The forum identifier.
     */
    getForumId() {
        return this.forumId;
    }

    /**
     * Set the forum identifier.
     * 
     * @param {number} forumId - The forum identifier. 
     */
    setForumId(forumId) {
        this.forumId = forumId;
    }

    /**
     * The URL to download this attachment.
     * 
     * @returns {string} The URL web address to download this attachment.
     */
    url() {
        return UtilHelper.buildUrl(['download', 'attachment', this.getId(), 'forum', this.getForumId()]);
    }

    /**
     * Builds this entity component.
     * 
     * @returns {string} The entity component source HTML.
     */
    build() {
        return OutputHelper.getPartial('attachmentEntity', 'entity', {
            fileName: this.getFileName(),
            fileSize: FileHelper.formatFileSize(this.getFileSize()),
            download: {
                url: this.url(),
                totalDownloads: LocaleHelper.replace('attachmentEntity', 'totalDownloads', 'total', UtilHelper.formatNumber(this.getTotalDownloads())),
            },
        });
    }
}

module.exports = Attachment;