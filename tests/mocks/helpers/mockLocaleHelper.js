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

class MockLocaleHelper {
    static locale = {};

    static initialize(locale) {
        MockLocaleHelper.locale = locale;
    }

    /**
     * Get the entire locale collection in a single object.
     * 
     * @returns {Object} The entire locale collection.
     */
    static getAll() {
        return { ...this.locale };
    }

    /**
     * Get the locale for the given category.
     * 
     * @param {string} category - The name of the category to get. 
     * @returns {Object} The object containg the locale for the given category name.
     */
    static getCategory(category) {
        return MockLocaleHelper.locale[category];
    }

    /**
     * Get the locale string for the given category and string identifier.
     * 
     * @param {string} category - The name of the category to get.
     * @param {string} stringIdentifier - The string identifier from the category to get.
     * @returns {string} The localized string.
     */
    static get(category, stringIdentifier) {
        return MockLocaleHelper.locale[category][stringIdentifier];
    }

    /**
     * Replace a single item in the given category and string identifier locale string.
     * 
     * @param {string} category - The name of the category to get.
     * @param {string} stringIdentifier - The string identifier from the category to get.
     * @param {string} needle - The string in which to replace.
     * @param {string} replacement - The replacement string.
     * @returns {string} Locale string with replacements.
     */
    static replace(category, stringIdentifier, needle, replacement) {
        let words = this.get(category, stringIdentifier);        
        return words.replace('${' + needle + '}', replacement);
    }

    /**
     * Replace multiple items in the specified category and string identifier locale string.
     * 
     * @param {string} category - The name of the category to get.
     * @param {string} stringIdentifier - The string identifier from the category to get.
     * @param {Object[]} replacements - Oject containing key-value pairs for replacements.
     * @returns {string} Locale string with replacements. 
     */
    static replaceAll(category, stringIdentifier, replacements) {
        let words = this.get(category, stringIdentifier);

        for (const key in replacements) {
            words = words.replace('${' + key + '}', replacements[key]);
        }

        return words;
    }
}

module.exports = MockLocaleHelper;