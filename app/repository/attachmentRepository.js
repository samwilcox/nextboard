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

const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * AttachmentRepository is responsible for handling and retrieval and construction of 'Attachment' entity.
 */
class AttachmentRepository {
    /**
     * Fetch a attachment's raw data by ID from the cache.
     * 
     * @param {number} attachmentId - The attachment identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadAttachmentDataById(attachmentId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('member_attachments').find(attachment => attachment.id === parseInt(attachmentId, 10));
        return data || null;
    }

    /**
     * Build a 'Attachment' entity from raw data.
     * 
     * @param {Object} data - The raw attachment data. 
     * @param {number} attachmentId - The attachment identifier.
     * @returns {Attachment|null} The constructed 'Attachment' entity or null if data is invalid.
     */
    static buildAttachmentFromData(data, attachmentId) {
        const Attachment = require('../entities/attachment');
        const attachment = new Attachment();

        if (!data) return null;
        
        attachment.setId(data ? data.id : attachmentId);
        attachment.setMemberId(parseInt(data.memberId, 10));
        attachment.setFileName(data.fileName);
        attachment.setFileSize(parseInt(data.fileSize, 10));
        attachment.setUploadedAt(DateTimeHelper.epochToDate(parseInt(data.uploadedAt, 10)));
        attachment.setTotalDownloads(parseInt(data.totalDownloads, 10));

        return attachment;
    }

    /**
     * Get the 'Attachment' entity by ID.
     * 
     * @param {number} attachmentId - The attachment identifier.
     * @returns {Attachment|null} The 'Attachment' entity or null if not found.
     */
    static getAttachmentById(attachmentId) {
        const data = this.loadAttachmentDataById(attachmentId);
        return this.buildAttachmentFromData(data, attachmentId);
    }
}

module.exports = AttachmentRepository;