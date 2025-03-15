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
 * CategoryRepository is responsible for handling and retrieval and construction of 'Category' entity.
 */
class CategoryRepository {
    /**
     * Fetch a categories raw data by ID from the cache.
     * 
     * @param {number} categoryId - The category identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadCategoryDataById(categoryId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('categories').find(category => category.id === categoryId);
        return data || null;
    }

    /**
     * Build a 'Category' entity from raw data.
     * 
     * @param {Object} data - The raw category data. 
     * @param {number} categoryId - The category identifier.
     * @returns {Category|null} The constructed 'Category' entity or null if data is invalid.
     */
    static buildCategoryFromData(data, categoryId) {
        const Category = require('../entities/category');
        const category = new Category();
        
        category.setId(data ? data.id : categoryId);
        category.setTitle(data.title);
        category.setSortOrder(parseInt(data.sortOrder, 10));
        category.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));
        category.setVisible(parseInt(data.visible, 10) === 1);

        return category;
    }

    /**
     * Get the 'Category' entity by ID.
     * 
     * @param {number} categoryId - The category identifier.
     * @returns {Category|null} The 'Category' entity or null if not found.
     */
    static getCategoryById(categoryId) {
        const data = this.loadCategoryDataById(categoryId);
        return this.buildCategoryFromData(data, categoryId);
    }
}

module.exports = CategoryRepository;