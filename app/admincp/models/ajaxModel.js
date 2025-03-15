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

const AjaxHelper = require("../helpers/ajaxHelper");

/**
 * Model for AJAX requests.
 */
class AjaxModel {
    /**
     * Returns a new instance of AjaxModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Updates the menu category toggle settings.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The object to be converted to JSON.
     */
    async updateMenuCategoryToggle(req) {
        return await AjaxHelper.updateMenuCategoryToggle(req);
    }
}

module.exports = AjaxModel;