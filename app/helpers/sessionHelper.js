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
 * Helpers for working with sessions.
 */
class SessionHelper {
    /**
     * Set a session variable.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} key - The name of the key to set.
     * @param {any} value - The value to set for the given key.
     */
    static set(req, key, value) {
        if (!req.session) {
            throw new Error('Session is not initialized');
        }

        req.session[key] = value;
    }

    /**
     * Get a session variable value.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} key - The name of the key to get.
     * @returns {any|null} The value for the given key or null if the key does not exist.
     */
    static get(req, key) {
        return req.session && req.session[key] ? req.session[key] : null;
    }

    /**
     * Check if a session variable key exists.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} key - The name of the key to check.
     * @returns {boolean} True if the key exists, false if it does not exist.
     */
    static exists(req, key) {
        return req.session && key in req.session;
    }

    /**
     * Delete a session key.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} key - The name of the key to delete.
     */
    static delete(req, key) {
        if (req.session && this.exists(req, key)) {
            delete req.session[key];
        }
    }

    /**
     * Get the total size of the session variables.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {number} The total number of session variables.
     */
    static size(req) {
        req.session ? Object.keys(req.session).length : 0;
    }

    /**
     * Get the entire session object.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The session data object.
     */
    static getAll(req) {
        return { ...this.req.session || {} };
    }
}

module.exports = SessionHelper;