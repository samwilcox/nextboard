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

const CacheInterface = require('../cacheInterface');
const toCache = require('../toCache');
const DatabaseProviderFactory = require('../../db/databaseProviderFactory');
const QueryBuilder = require('../../db/queryBuilder');

/**
 * Concrete implementation of the CacheInterface for no caching.
 */
class NoCacheProvider extends CacheInterface {
    /**
     * Creates a new instance of NoCacheProvider.
     */
    constructor() {
        super();
        this.cache = {};
        this.toCache = toCache();
        this.db = DatabaseProviderFactory.create();
        this.builder = new QueryBuilder();
    }

    /**
     * Builds the cache.
     * 
     * @throws {Error} If the cache building process fails.
     */
    async build() {
        try {
            console.log('Building the cache...');

            await Promise.all(this.toCache.map(async (item) => {
                if (!this.cache.hasOwnProperty(item)) {
                    await this.update(item);
                }
            }));
        } catch (error) {
            console.error(`The cache building process failed: ${error}`);
            throw error;
        }
    }

    /**
     * Updates a given table in the cache.
     * 
     * @param {string} table - The name of the table to update in the cache.
     * @throws {Error} If the cache update fails.
     */
    async update(table) {
        try {
            const data = await this.db.fetchAll(this.builder.clear().select().from(table).build());
            
            if (!data || data.length === 0) {
                console.warn(`No data returned for table: ${table}`);
            }
        } catch (error) {
            console.error(`Failed to update cache for table: ${table}. Error: ${error}`);
            throw error;
        }
    }

    /**
     * Update a list of tables in the cache.
     * 
     * @param {string[]} tables - An array of table names to update in the cache.
     * @throws {Error} If the tables parameter is not an array.
     */
    async updateAll(tables) {
        if (!Array.isArray(tables)) {
            throw new Error(`cache provider updateAll() tables parameter must be an array`);
        }

        for (const table of tables) {
            await this.update(table);
        }
    }

    /**
     * Get the data array for the given table name.
     * 
     * @param {string} table - The name of the table to get data for.
     * @returns {Object[]} An array of data objects for the specified table name.
     */
    get(table) {
        if (table in this.cache) {
            return this.cache[table];
        }

        return [];
    }

    /**
     * Get data for a given list of table names.
     * 
     * @param {Object} tables - An object containing key-value pairs mapping the table name.
     *                          Example: { 'member': 'member_photos' } 
     *                          Key => the key name. Value => the table name.
     * @returns {Object} An object with key-value pairs for each requested table and its respected data.
     * @throws {Error} If the tables parameter is not an array.
     */
    getAll(tables) {
        if (!tables) {
            throw new Error('cache provider getAll() tables parameter must be an array');
        }

        const list = {};

        for (const key in tables) {
            list[key] = this.get(tables[key]);
        }

        return list;
    }
}

module.exports = NoCacheProvider;