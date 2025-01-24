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
 * An entity that represents a single setting.
 */
class Setting {
    /**
     * Returns a new instance of Setting.
     */
    constructor() {
        this.id = null;
        this.type = null;
        this.name = null;
        this.value = null;
        this.defaultValue = null;
    }

    /**
     * Get the setting identifier.
     * 
     * @returns {number} The setting identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the setting identifier.
     * 
     * @param {number} id - The setting identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the setting type.
     * 
     * @returns {string} The setting type.
     */
    getType() {
        return this.type;
    }

    /**
     * Set the setting type.
     * 
     * @param {string} type - The setting type.
     */
    setType(type) {
        this.type = type;
    }

    /**
     * Get the setting name.
     * 
     * @returns {string} The setting name.
     */
    getName() {
        return this.name;
    }

    /**
     * Set the setting name.
     * 
     * @param {string} name - The setting name.
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Get the setting value.
     * 
     * @returns {*} The setting value.
     */
    getValue() {
        return this.value;
    }

    /**
     * Set the setting value.
     * 
     * @param {any} value - The setting value.
     */
    setValue(value) {
        this.value = value;
    }

    /**
     * Get the default value for the setting.
     * 
     * @returns {any} The default value.
     */
    getDefaultValue() {
        return this.defaultValue;
    }

    /**
     * Set the default value for the setting.
     * 
     * @param {any} defaultValue - The default value.
     */
    setDefaultValue(defaultValue) {
        this.defaultValue = defaultValue;
    }
}

module.exports = Setting;