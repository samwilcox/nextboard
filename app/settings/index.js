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

const SettingRepository = require('../repository/settingRepository');

/**
 * Application settings management.
 */
class Settings {
    static settings = {};

    /**
     * Initializes the application settings.
     */
    static initialize() {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('settings');

        if (!Array.isArray(data)) {
            throw new Error('Settings data is not in expected array format');
        }

        data.forEach(setting => {
            this.settings[setting.name] = SettingRepository.getSettingById(setting.id);
        });
    }

    /**
     * Get a setting value.
     * 
     * @param {string} key - The name of the setting key to get.
     * @returns {any|null} The setting value or null if the setting does not exist.
     */
    static get(key) {
        if (typeof key !== 'string') {
            throw new Error('Setting key must be a string');
        }

        return this.exists(key) ? this.settings[key] : null;
    }

    /**
     * Check if a setting key exists.
     * 
     * @param {string} key - The name of the key to check.
     * @returns {boolean} True if the key exists, false if it does not.
     */
    static exists(key) {
        if (typeof key !== 'string') {
            throw new Error('Setting key must be a string');
        }

        return this.settings.hasOwnProperty(key);
    }

    /**
     * Get the entire settings object.
     * 
     * @returns {Object} The entire settings collection object.
     */
    static getAll() {
        return { ...this.settings };
    }

    static empty() {
        return Object.keys(this.settings).length === 0;
    }
}

module.exports = Settings;