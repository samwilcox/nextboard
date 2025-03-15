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
 * TagRepository is responsible for handling and retrieval and construction of 'Tag' entity.
 */
class TagRepository {
    /**
     * Fetch a tag's raw data by ID from the cache.
     * 
     * @param {number} tagId - The tag identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadTagDataById(tagId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('tags').find(tag => tag.id === tagId);
        return data || null;
    }

    /**
     * Build a 'Tag' entity from raw data.
     * 
     * @param {Object} data - The raw tag data. 
     * @param {number} tagId - The tag identifier.
     * @returns {Tag|null} The constructed 'Tag' entity or null if data is invalid.
     */
    static buildTagFromData(data, tagId) {
        const Tag = require('../entities/tag');
        const tag = new Tag();
        
        tag.setId(data.id ? data.id : tagId);
        tag.setTitle(data.title);
        tag.setCreatedBy(parseInt(data.createdBy, 10));
        tag.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));

        return tag;
    }

    /**
     * Get the 'Tag' entity by ID.
     * 
     * @param {number} tagId - The tag identifier.
     * @returns {Tag|null} The 'Tag' entity or null if not found.
     */
    static getTagById(tagId) {
        const data = this.loadTagDataById(tagId);
        return this.buildTagFromData(data, tagId);
    }
}

module.exports = TagRepository;