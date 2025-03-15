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
 * PostRepository is responsible for handling and retrieval and construction of 'Post' entity.
 */
class PostRepository {
    /**
     * Fetch a post's raw data by ID from the cache.
     * 
     * @param {number} postId - The post identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadPostDataById(postId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('posts').find(post => post.id === postId);
        return data || null;
    }

    /**
     * Build a 'Post' entity from raw data.
     * 
     * @param {Object} data - The raw post data. 
     * @param {number} postId - The post identifier.
     * @returns {Post|null} The constructed 'Post' entity or null if data is invalid.
     */
    static buildPostFromData(data, postId) {
        const Post = require('../entities/post');
        let post = new Post();
        
        if (data) {
            post.setId(data ? data.id : postId);
            post.setCategoryId(parseInt(data.categoryId, 10));
            post.setForumId(parseInt(data.forumId, 10));
            post.setTopicId(parseInt(data.topicId, 10));
            post.setCreatedBy(parseInt(data.createdBy, 10));
            post.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));
            post.setContent(data.content);
            post.setTags(data.tags ? JSON.parse(data.tags) : null);
            post.setAttachments(data.attachments ? JSON.parse(data.attachments) : null);
            post.setIsFirstPost(parseInt(data.isFirstPost, 10) === 1);
            post.setIpAddress(data.ipAddress);
            post.setHostname(data.hostname);
            post.setUserAgent(data.userAgent);
            post.setIncludeSignature(parseInt(data.includeSignature, 10) === 1);
        } else {
            post = null;
        }

        if (data) {
            post.determinePostNumber();
        }

        return post;
    }

    /**
     * Get the 'Post' entity by ID.
     * 
     * @param {number} postId - The post identifier.
     * @returns {Post|null} The 'Post' entity or null if not found.
     */
    static getPostById(postId) {
        const data = this.loadPostDataById(postId);
        return this.buildPostFromData(data, postId);
    }
}

module.exports = PostRepository;