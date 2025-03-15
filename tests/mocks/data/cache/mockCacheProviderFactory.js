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

require('dotenv').config();
const MockNocacheProvider = require('./providers/mockNocacheProvider');

class MockCacheProviderFactory {
    static instances = {};

    static create() {
        const enabled = process.env.CACHE_ENABLED === 'true';
        const cacheMethod = (process.env.CACHE_METHOD || 'nocache').toLowerCase();

        if (!this.instances[cacheMethod]) {
            if (enabled) {
                switch (cacheMethod) {
                    default:
                        this.instances[cacheMethod] = new MockNocacheProvider();
                        break;
                }
            } else {
                this.instances[cacheMethod] = new MockNocacheProvider();
            }   
        }

        return this.instances[cacheMethod];
    }

    static reset() {
        this.instances = {};
    }
}

module.exports = MockCacheProviderFactory;