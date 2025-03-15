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
 * Model for managing forum related settings.
 */
class ForumManagementModel {
    /**
     * Returns a new instance of ForumManagementModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Manage bulletin board features.
     * 
     * @returns {Object} The resulting vars object instance.
     */
    async manageFeatures() {
        return this.vars;
    }
}

module.exports = ForumManagementModel;