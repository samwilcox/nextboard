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
 * Service that allows the storage and retrieval of temporary data.
 */
class DataStoreService {
    static instance = null;

    /**
     * Returns a new instance of DataStoreService.
     */
    constructor() {
        this.data = {};
    }

    /**
     * Get the singleton instance of DataStoreService.
     */
    static getInstance() {
        if (!DataStoreService.instance) {
            DataStoreService.instance = new DataStoreService();
        }

        return DataStoreService.instance;
    }

    /**
     * Set a new key-value pair in the datastore.
     * 
     * @param {string} key - The name of the key to set.
     * @param {any} value - The value to set.
     */
    set(key, value) {
        this.data[key] = value;
    }

    /**
     * Get a value for a given key in the datastore.
     * 
     * @param {string} key - The name of the key to get value for.
     * @returns {any|null} The value for the given key or null if it does not exist.
     */
    get(key) {
        return this.exists(key) ? this.data[key] : null;
    }

    /**
     * Check if a key exists in the datastore.
     * 
     * @param {string} key - The name of the key to check.
     * @returns {boolean} True if the key exists, false if it does not.
     */
    exists(key) {
        return this.data.hasOwnProperty(key);
    }
    
    /**
     * Get the total items in the datastore.
     */
    size() {
        return Object.keys(this.data).length;
    }

    /**
     * Clear the datastore of all data.
     */
    clear() {
        this.data = {};
    }

    /**
     * Get the entire datastore object collection.
     * 
     * @returns {Object} The datastore data object instance.
     */
    getAll() {
        return { ...this.data };
    }
}

module.exports = DataStoreService.getInstance();