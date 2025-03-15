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
 * NextBoard invalid permissions error.
 */
class InvalidPermissionsError extends Error {
    /**
     * Creates a new instance of InvalidPermissions.
     * 
     * @param {string} message - The error message.
     * @param {string} permission - The permission that the user has invalid permissions to.
     * @param {Object} [data={}] - Optional error metadata. 
     */
    constructor(message, data = {}) {
        super(message);
        this.name = this.constructor.name;
        this.permission = this.permission;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidPermissionsError;