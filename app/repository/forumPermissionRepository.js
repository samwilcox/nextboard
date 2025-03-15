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

/**
 * ForumPermissionRepository is responsible for handling and retrieval and construction of 'ForumPermission' entity.
 */
class ForumPermissionRepository {
    /**
     * Fetch a forum permission's raw data by ID from the cache.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadForumPermissionDataByForumId(forumId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('forum_permissions').find(permission => permission.forumId === parseInt(forumId, 10));
        return data || null;
    }

    /**
     * Build a 'ForumPermission' entity from raw data.
     * 
     * @param {Object} data - The raw forum permission data. 
     * @param {number} forumId - The forum permission identifier.
     * @returns {ForumPermission|null} The constructed 'ForumPermission' entity or null if data is invalid.
     */
    static buildForumPermissionFromData(data, forumId) {
        const ForumPermission = require('../entities/forumPermission');
        let forumPermission = new ForumPermission();

        if (!forumPermission) return null;
        
        forumPermission.setId(data.id);
        forumPermission.setForumId(data ? data.forumId : parseInt(forumId, 10));
        forumPermission.setViewForum(data.viewForum ? JSON.parse(data.viewForum) : null);
        forumPermission.setCreateTopic(data.createTopic ? JSON.parse(data.createTopic) : null);
        forumPermission.setReplyToTopic(data.replyToTopic ? JSON.parse(data.replyToTopic) : null);
        forumPermission.setEditPosts(data.editPosts ? JSON.parse(data.editPosts) : null);
        forumPermission.setDeletePosts(data.deletePosts ? JSON.parse(data.deletePosts) : null);
        forumPermission.setViewPolls(data.viewPolls ? JSON.parse(data.viewPolls) : null);
        forumPermission.setCreatePolls(data.createPolls ? JSON.parse(data.createPolls) : null);
        forumPermission.setCastInPolls(data.castInPolls ? JSON.parse(data.castInPolls) : null);
        forumPermission.setEditPolls(data.editPolls ? JSON.parse(data.editPolls) : null);
        forumPermission.setLikeTopics(data.likeTopics ? JSON.parse(data.likeTopics) : null);
        forumPermission.setLikePosts(data.likePosts ? JSON.parse(data.likePosts) : null);
        forumPermission.setUnlikeTopics(data.unlikeTopics ? JSON.parse(data.unlikeTopics) : null);
        forumPermission.setUnlikePosts(data.unlikePosts ? JSON.parse(data.unlikePosts) : null);
        forumPermission.setAttachFiles(data.attachFiles ? JSON.parse(data.attachFiles) : null);
        forumPermission.setDownloadFiles(data.downloadFiles ? JSON.parse(data.downloadFiles) : null);
        forumPermission.setMarkAsSolved(data.markAsSolved ? JSON.parse(data.markAsSolved) : null);

        return forumPermission;
    }

    /**
     * Get the 'ForumPermission' entity by ID.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {ForumPermission|null} The 'ForumPermission' entity or null if not found.
     */
    static getForumPermissionByForumId(forumId) {
        const data = this.loadForumPermissionDataByForumId(forumId);
        return this.buildForumPermissionFromData(data, forumId);
    }
}

module.exports = ForumPermissionRepository;