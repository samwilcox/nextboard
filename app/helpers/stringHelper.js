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

const sanitizeHtml = require('sanitize-html');
const Settings = require('../settings');

/**
 * Helpers that help manipulate strings, manage strings, etc.
 */
class StringHelper {
    /**
     * Sanitize the give HTML before we store it in the database.
     * 
     * @param {string} html - The HTML to sanitize.
     * @returns {string} The sanitized HTML.
     */
    static sanitizeInput(html) {
        return sanitizeHtml(html, {
            allowedTags: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br'],
            allowedAttributes: {
                'a': ['href', 'title']
            },
            allowedIframeHostnames: [],
        });
    }

    /**
     * Censors bad words in a given text.
     * 
     * @param {string} text - The input text.
     * @param {Object} [options={}] - Options for censoring text.
     * @param {string} [options.replacementChar='*'] - The character to replace bad words with.
     * @returns {string} The censored text.  
     */
    static censorText(text, options = {}) {
        const { replacementChar = '*' } = options;
        let censoredText = text;
        const regexList = this.generateRegexList(Settings.get('wordsToCensor'));

        regexList.forEach(regex => {
            censoredText = censoredText.replace(regex, match => replacementChar.repeat(match.length));
        });

        return censoredText;
    }

    /**
     * Generates regex patterns for censoring words.
     * 
     * @param {string[]} words - List of words to censor.
     * @returns {RegExp[]} List of regex patterns. 
     */
    static generateRegexList(words) {
        return words.map(word => {
            const safeWord = word.replace(/[^a-zA-Z0-9]/g, "");
            const variations = this.generateVariations(safeWord);
            return new RegExp(`\\b(${variations.join("|")})\\b`, "gi");
        });
    }

    /**
     * Generates common variations of word (leetspeak, spaces, etc).
     * 
     * @param {string} word - The base word.
     * @returns {string[]} List of variations.
     */
    static generateVariations(word) {   
        const leetMap = { "a": "@", "b": "8", "e": "3", "g": "9", "i": "1", "o": "0", "s": "$", "t": "+" };
        const variations = new Set();

        variations.add(word);
        variations.add(word.replace(/./g, c => leetMap[c] || c));
        variations.add([...word].join(" "));
        variations.add([...word].join("."));
        variations.add([...word].join("-"));

        return Array.from(variations);
    }
}

module.exports = StringHelper;