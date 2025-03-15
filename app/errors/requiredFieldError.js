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
 * NextBoard required field error.
 */
class RequiredFieldError extends Error {
    /**
     * Creates a new instance of RequiredFieldError.
     * 
     * @param {string} message - The error message.
     * @param {string} field - The field that is missing.
     * @param {Object} [data={}] - Optional error metadata. 
     */
    constructor(message, field, data = {}) {
        super(message);
        this.name = this.constructor.name;
        this.field = field;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = RequiredFieldError;