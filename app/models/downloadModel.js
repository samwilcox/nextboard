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

const LocaleHelper = require("../helpers/localeHelper");
const AttachmentRepository = require("../repository/attachmentRepository");
const ForumRepository = require("../repository/forumRepository");
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require('../types/forumPermissions');
const Settings = require('../settings');
const path = require('path');
const MemberRepository = require("../repository/memberRepository");
const CacheProviderFactory = require("../data/cache/cacheProviderFactory");
const DatabaseProviderFactory = require("../data/db/databaseProviderFactory");
const QueryBuilder = require("../data/db/queryBuilder");

/**
 * Model for the downloads.
 */
class DownloadModel {
    /**
     * Returns a new instance of DownloadModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Download the selected attachment.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async downloadAttachment(req, res) {
        try {
            const { attachmentId, forumId } = req.params;
            const attachment = AttachmentRepository.getAttachmentById(parseInt(attachmentId, 10));
            const forum = ForumRepository.getForumById(parseInt(forumId, 10));

            if (!attachment) {
                return res.status(404).json({ error: LocaleHelper.get('errors', 'attachmentNotFound') });
            }

            if (!forum) {
                return res.status(404).json({ error: LocaleHelper.get('errors', 'forumDoesNotExistForAttachment') });
            }

            if (!PermissionsService.hasForumPermission(forum.getId(), ForumPermissions.DOWNLOAD_FILES)) {
                return res.status(403).json({ error: LocaleHelper.get('errors', 'invalidDownloadPermissions') });
            }

            const attachmentFilePath = path.join(__dirname, '..', '..', 'public', Settings.get('uploadsDir'), Settings.get('attachmentsDir'), `member-${attachment.getMemberId()}`, attachment.getFileName());
            const cache = CacheProviderFactory.create();
            const db = DatabaseProviderFactory.create();
            const builder = new QueryBuilder();

            await new Promise((resolve, reject) => {
                res.download(attachmentFilePath, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            const totalDownloads = attachment.getTotalDownloads() + 1;

            await db.query(builder
                .clear()
                .update('member_attachments')
                .set(['totalDownloads'], [totalDownloads])
                .where('id = ?', [attachment.getId()])
                .build()
            );

            await cache.update('member_attachments');
        } catch (error) {
            console.error('Error downloading attachment:', error);
            return res.status(500).json({ error: LocaleHelper.get('errors', 'errorDownloadingFile') });
        }
    }
}

module.exports = DownloadModel;