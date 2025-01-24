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

const CacheProviderFactory = require('../data/cache/cacheProviderFactory');

/**
 * Builds the cache from the database.
 * 
 * @returns {Promise} Resolves when the cache has been built.
 */
module.exports = () => {
    const cache = CacheProviderFactory.create();

    return cache
        .build()
        .then(() => {
            console.log('Cache built.');
        });
};