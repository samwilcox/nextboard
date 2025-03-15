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
 * Helpers for managing user cookies.
 */
class CookieHelper {
    /**
     * Set a cookie.
     * 
     * @param {Object} res - The response object from Express.
     * @param {string} name - The name of the cookie to set.
     * @param {any} value - The value to set for the cookie.
     * @param {Object} [options={}] - Options for setting the cookie. 
     */
    static set(res, name, value, options = {}) {
        options = options || {};
        if (res.headersSent) {
            if (process.env.DEBUG === 'true') {
                console.warn('[DEBUG] Headers already sent, cannot modify headers.');
            }

            return;
        }

        const cookieOptions = {
            httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
            secure: process.env.COOKIE_SECURE === 'true',
            path: process.env.COOKIE_PATH || '/',
            domain: process.env.COOKIE_DOMAIN || '',
            maxAge: options.maxAge || parseInt(process.env.COOKIE_DEFAULT_MAX_AGE_SECONDS, 10),
            sameSite: options.sameSite || process.env.COOKIE_SAME_SITE,
            ...options,
        };

        res.cookie(name, value, cookieOptions);
    }

    /**
     * Get a cookie.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} name - The name of the cookie to get.
     * @returns {any|null} The cookie value or null if the cookie does not exist.
     */
    static get(req, name) {
        return req.cookies?.[name] || null;
    }

    /**
     * Delete a cookie.
     * 
     * @param {Object} res - The response object from Express.
     * @param {string} name - The name of the cookie to delete.
     * @param {Object} [options={}] - Options for deleting the cookie. 
     */
    static delete(res, name, options = {}) {
        const deleteOptions = {
            ...options,
            maxAge: 0,
        };

        this.set(res, name, '', deleteOptions);
    }

    /**
     * Check if a cookie exists.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} name - The name of the cookie to check.
     * @returns {boolean} True if the cookie exists, false if it does not.
     */
    static exists(req, name) {
        return this.get(req, name) !== null;
    }
}

module.exports = CookieHelper;