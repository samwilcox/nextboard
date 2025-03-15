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
 * LikeRepository is responsible for handling and retrieval and construction of 'Like' entity.
 */
class LikeRepository {
    /**
     * Fetch a like's raw data by ID from the cache.
     * 
     * @param {number} likeId - The like identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadLikeDataById(likeId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('liked_content').find(like => like.id === likeId);
        return data || null;
    }

    /**
     * Build a 'Like' entity from raw data.
     * 
     * @param {Object} data - The raw like data. 
     * @param {number} likeId - The like identifier.
     * @returns {Like|null} The constructed 'Like' entity or null if data is invalid.
     */
    static buildLikeFromData(data, likeId) {
        const Like = require('../entities/like');
        const like = new Like();
        
        if (!data) return null;

        like.setId(data ? data.id : likeId);
        like.setContentType(data.contentType);
        like.setContentId(parseInt(data.contentId, 10));
        like.setMemberId(parseInt(data.memberId, 10));
        like.setLikedAt(DateTimeHelper.epochToDate(parseInt(data.likedAt, 10)));

        return like;
    }

    /**
     * Get the 'Like' entity by ID.
     * 
     * @param {number} likeId - The like identifier.
     * @returns {Like|null} The 'Like' entity or null if not found.
     */
    static getLikeById(likeId) {
        const data = this.loadLikeDataById(likeId);
        return this.buildLikeFromData(data, likeId);
    }
}

module.exports = LikeRepository;