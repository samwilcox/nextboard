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

const CacheProviderFactory = require("../data/cache/cacheProviderFactory");
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require("../helpers/dateTimeHelper");

/**
 * RegistryService services for working with the NextBoard registry.
 */
class RegistryService {
    static instance = null;

    /**
     * Get the singleton instance of RegistryService.
     * 
     * @returns {RegistryService} The singleton instance of RegistryService.
     */
    static getInstance() {
        if (!RegistryService.instance) {
            RegistryService.instance = new RegistryService();
        }

        return RegistryService.instance;
    }

    /**
     * Get a value for a key in the registory.
     * 
     * @param {string} key - The name of the key to get value for.
     * @returns {any|null} The value for the given key or null if not found.
     */
    get(key) {
        return this.exists(key) ? this.getKey(key) : null;
    }

    /**
     * Set the given key in the registry.
     * 
     * @param {string} key - The name of the key to set.
     * @param {any} value - The value for the given key.
     * @param {"serialized"|"number"|"bool"|"float"|"string"} type - The data type of the value. 
     */
    async set(key, value, type = 'string') {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (this.exists(key)) {
            await db.query(builder
                .clear()
                .update('registry')
                .set(['value', 'updatedAt'], [type.toLowerCase() === 'serialized' ? JSON.stringify(value) : value, DateTimeHelper.dateToEpoch(new Date())])
                .where('name = ?', [key])
                .build()
            );

            await cache.update('registry');
        } else {
            await db.query(builder
                .clear()
                .insertInto('registry', [
                    'dataType', 'name', 'value', 'updatedAt'
                ], [
                    type.toLowerCase(), key, type.toLowerCase() === 'serialized' ? JSON.stringify(value) : value, DateTimeHelper.dateToEpoch(new Date())
                ])
                .build()
            );

            await cache.update('registry');
        }
    }

    /**
     * Check if a key exists in the registry.
     * 
     * @param {string} key - The name of the key to check.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    exists(key) {
        const cache = CacheProviderFactory.create();
        return cache.get('registry').find(reg => reg.name === key) ? true : false;
    }

    /**
     * Get the given key.
     * 
     * @param {string} key - The name of the key.
     * @returns {any|null} The value for the given key or null if not found.
     */
    getKey(key) {
        const cache = CacheProviderFactory.create();
        const data = cache.get('registry').find(reg => reg.name === key);
        const exists = data ? true : false;
        if (!exists) return null;
        
        switch (data.dataType) {
            case 'serialized':
                return JSON.parse(data.value);
            case 'number':
                return parseInt(data.value, 10);
            case 'bool':
                return data.value.toLowerCase() === 'true';
            case 'float':
                return parseFloat(data.value);
            case 'string':
                return data.value.toString();
            default:
                return data.value;
        }
    }
}

module.exports = RegistryService.getInstance();