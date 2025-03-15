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
const FileHelper = require('../helpers/fileHelper');
const path = require('path');

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
            if (process.env.DEBUG === 'true') {
                console.warn('Settings data is invalid or not found in the cache. Initializing with blank settings.');
                this.settings = {};
                return;
            }
        }

        data.forEach(setting => {
            if (!setting.name || !setting.id) {
                if (process.env.DEBUG === 'true') {
                    console.warn(`Skipping invalid setting: ${JSON.stringify(setting)}`);
                    return;
                }
            }

            this.settings[setting.name] = SettingRepository.getSettingById(setting.id);
        });

        const emoticonsFilePath = path.join(__dirname, '..', '..', 'emoticons.json');
        const fileData = FileHelper.readFile(emoticonsFilePath);
        const emoticons = JSON.parse(fileData);

        if (emoticons && Array.isArray(emoticons) && emoticons.length > 0) {
            this.settings.emoticons = emoticons;
        }
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

        if (this.exists(key)) {
            const setting = this.settings[key];

            if (setting && typeof setting.getValue === 'function') {
                return setting.getValue();
            }
            
            return setting;
        }

        return null;
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

    /**
     * Get the entire settings as raw data object.
     * 
     * @returns {Object} The entire setting raw data collection object.
     */
    static getAllRaw() {
        const data = {};

        Object.entries(this.settings).forEach(([key, setting]) => {
            if (setting && typeof setting.getValue === 'function') {
                data[key] = setting.getValue();
            } else {
                console.warn(`[WARN]: Setting '${key}' is not an object with getValue()`);
                data[key] = setting;
            }
        });
        
        return data;
    }

    /**
     * Check if the settings collection is empty.
     * 
     * @returns {boolean} True if there are no settings, false otherwise.
     */
    static empty() {
        return Object.keys(this.settings).length === 0;
    }
}

module.exports = Settings;