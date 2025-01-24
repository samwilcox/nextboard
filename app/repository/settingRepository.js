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
 * SettingRepository is responsible for handling and retrieval and construction of 'Setting' entity.
 */
class SettingRepository {
    /**
     * Fetch a setting's raw data by ID from the cache.
     * 
     * @param {number} settingId - The setting identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadSettingDataById(settingId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('settings').find(setting => setting.id === settingId);
        return data || null;
    }

    /**
     * Build a 'Setting' entity from raw data.
     * 
     * @param {Object} data - The raw setting data. 
     * @param {number} settingId - The setting identifier.
     * @returns {Setting|null} The constructed 'Setting' entity or null if data is invalid.
     */
    static buildSettingFromData(data, settingId) {
        const Setting = require('../entities/setting');
        const setting = new Setting();
        setting.setId(data ? data.id : settingId);
        setting.setType(data && data.type ? data.type : null);
        setting.setName(data && data.name ? data.name : null);

        try {
            switch (setting.getType()) {
                case 'serialized':
                    setting.setValue(setting.value.toString().length > 0 ? JSON.parse(setting.value) : null);
                    setting.setDefaultValue(setting.value.toString().length > 0 ? JSON.parse(setting.value) : null);
                    break;
                case 'bool':
                    setting.setValue(typeof setting.value === 'string' ? setting.value.toLowerCase() === 'true' : false);
                    setting.setDefaultValue(typeof setting.value === 'string' ? setting.value.toLowerCase() === 'true' : false);
                    break;
                case 'number':
                    setting.setValue(parseInt(setting.value, 10));
                    setting.setDefaultValue(parseInt(setting.value, 10));
                    break;
                case 'float':
                    const float = parseFloat(setting.value);
    
                    if (isNaN(float)) {
                        throw new Error(`Invalid float value for setting: ${setting.name}`);
                    }
    
                    setting.setValue(parseFloat(float));
                    setting.setDefaultValue(parseFloat(float));
                    break;
                case 'string':
                    setting.setValue(setting.value.toString());
                    setting.setDefaultValue(setting.value.toString());
                    break;
                default:
                    setting.setValue(setting.value);
                    setting.setDefaultValue(setting.value);
                    break;
            }
        } catch (error) {
            console.error(`Error processing setting: ${setting.name}. Error: ${error}`);
            throw error;
        }
    }

    /**
     * Get the 'Setting' entity by ID.
     * 
     * @param {number} settingId - The setting identifier.
     * @returns {Setting|null} The 'Setting' entity or null if not found.
     */
    static getSettingById(settingId) {
        const data = this.loadSettingDataById(settingId);
        return this.buildSettingFromData(data, settingId);
    }
}

module.exports = SettingRepository;