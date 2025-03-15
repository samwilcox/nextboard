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
 * NextBoard not found error.
 */
class NotFoundError extends Error {
    /**
     * Creates a new instance of NotFoundError.
     * 
     * @param {string} message - The error message.
     * @param {Object} [data={}] - Optional error metadata. 
     */
    constructor(message, data = {}) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = NotFoundError;