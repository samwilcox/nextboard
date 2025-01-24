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

const NoCacheProvider = require('./providers/noCacheProvider');

/**
 * Factory class for creating instances of different cache providers.
 * Based on the provider type, it returns the corresponding cache provider.
 */
class CacheProviderFactory {
    static instance = null;

    /**
     * Creates an instance of a cache provider based on the set type.
     * 
     * @returns {CacheInterface} An instance of the appropriate cache provider.
     * @throws {Error} If the specified cache type is not supported.
     */
    static create() {
        if (CacheProviderFactory.instance !== null) {
            return CacheProviderFactory.instance;
        }

        const enabled = process.env.CACHE_ENABLED === 'true';

        if (enabled) {
            switch (process.env.CACHE_METHOD.toLowerCase()) {
                default:
                    CacheProviderFactory.instance = new NoCacheProvider();
            }
        } else {
            CacheProviderFactory.instance = new NoCacheProvider();
        }

        return CacheProviderFactory.instance;
    }
}

module.exports = CacheProviderFactory;