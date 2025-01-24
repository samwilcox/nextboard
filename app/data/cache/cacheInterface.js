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
 * Interface contract for cache providers to implement.
 */
class CacheInterface {
    /**
     * Builds the cache.
     * This method MUST be implemented by a concrete cache provider class.
     * 
     * @throws {Error} If this method is not implemented.
     */
    build() {
        throw new Error('build() method must be implemented');
    }

    /**
     * Updates a given table in the cache.
     * This method MUST be implemented by a concrete cache provider class.
     * 
     * @param {string} table - The name of the table to update in the cache.
     * @throws {Error} If this method is not implemented.
     */
    update(table) {
        throw new Error('update() method must be implemented');
    }

    /**
     * Update a list of tables in the cache.
     * This method MUST be implemented by a concrete cache provider class.
     * 
     * @param {string[]} tables - An array of table names to update in the cache.
     * @throws {Error} If this method is not implemented.
     */
    updateAll(tables) {
        throw new Error('updateAll() method must be implemented');
    }

    /**
     * Get the data array for the given table name.
     * This method MUST be implemented by a concrete cache provider class.
     * 
     * @param {string} table - The name of the table to get data for.
     * @returns {Object[]} An array of data objects for the specified table name.
     * @throws {Error} If this method is not implemented.
     */
    get(table) {
        throw new Error('get() method must be implemented');
    }

    /**
     * Get data for a given list of table names.
     * This method MUST be implemented by a concrete cache provider class.
     * 
     * @param {Object} tables - An object containing key-value pairs mapping the table name.
     *                          Example: { 'member': 'member_photos' } 
     *                          Key => the key name. Value => the table name.
     * @returns {Object} An object with key-value pairs for each requested table and its respected data.
     * @throws {Error} If this method is not implemented.
     */
    getAll(tables) {
        throw new Error('getAll() method must be implemented');
    }
}

module.exports = CacheInterface;