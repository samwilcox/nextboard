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
 * ForumRepository is responsible for handling and retrieval and construction of 'Forum' entity.
 */
class ForumRepository {
    /**
     * Fetch a forum's raw data by ID from the cache.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadForumDataById(forumId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('forums').find(forum => forum.id === parseInt(forumId, 10));
        return data || null;
    }

    /**
     * Build a 'Forum' entity from raw data.
     * 
     * @param {Object} data - The raw forum data. 
     * @param {number} forumId - The forum identifier.
     * @returns {Forum|null} The constructed 'Forum' entity or null if data is invalid.
     */
    static buildForumFromData(data, forumId) {
        const Forum = require('../entities/forum');
        const forum = new Forum();

        if (!data) return null;
        
        forum.setId(data ? data.id : forumId);
        forum.setCategoryId(parseInt(data.categoryId));
        forum.setTitle(data.title);
        forum.setDescription(data.description);
        forum.setSortOrder(parseInt(data.sortOrder, 10));
        forum.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));
        forum.setHasParent(parseInt(data.hasParent, 10) === 1);
        forum.setParentId(data.parentId ? parseInt(data.parentId) : 0);
        forum.setShowSubForums(parseInt(data.setShowSubForums, 10) === 1);
        forum.setVisible(parseInt(data.visible, 10) === 1);
        forum.setArchived(parseInt(data.archived, 10) === 1);
        forum.setImage(data.image ? data.image : null);
        forum.setTotalTopics(parseInt(data.totalTopics, 10));
        forum.setTotalPosts(parseInt(data.totalPosts, 10));
        forum.setLastPostId(data.lastPostId ? parseInt(data.lastPostId, 10) : null);
        forum.setRedirect(data.redirect ? JSON.parse(data.redirect) : null);
        forum.setPasswordProtected(parseInt(data.passwordProtected, 10) === 1);
        forum.setPassword(data.password ? data.password : null);
        forum.setForumType(data.forumType);
        forum.setCan(data.can ? JSON.parse(data.can) : null);
        forum.setHotThreshold(data.hotThreshold ? parseInt(data.hotThreshold, 10) : 20);
        forum.setPopularityThreshold(data.popularityTheshold ? parseInt(data.popularityTheshold, 10) : 100);
        forum.setDefaultFilters(data.defaultFilters ? JSON.parse(data.defaultFilters) : null);
        forum.setUniqueViewIncrementation(parseInt(data.uniqueViewIncrementation, 10) === 1);
        forum.setPoll(data.poll ? JSON.parse(data.poll) : {});
        
        return forum;
    }

    /**
     * Get the 'Forum' entity by ID.
     * 
     * @param {number} forumId - The category identifier.
     * @returns {Forum|null} The 'Forum' entity or null if not found.
     */
    static getForumById(forumId) {
        const data = this.loadForumDataById(forumId);
        return this.buildForumFromData(data, forumId);
    }
}

module.exports = ForumRepository;