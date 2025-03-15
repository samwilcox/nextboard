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

const UtilHelper = require("./utilHelper");

/**
 * AjaxHelper that contains helpers for AJAX related tasks.
 */
class AjaxHelper {
    /**
     * Build the AJAX response object.
     * 
     * @param {boolean} success - True if response is successful, false if unsuccessful.
     * @param {Object} [data={}] - An object containing the data to send.
     * @returns {Object} The resulting response object. 
     */
    static buildResponse(success, data = {}) {
        return {
            success: success,
            data,
        };
    }

    /**
     * Update the menu category toggle flag.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Promise<Object>} A promise that resolves to an object to be converted to JSON.
     */
    static async updateMenuCategoryToggle(req) {
        const { category, toggle } = req.body;
        const locale = req.locale;

        if (!category || toggle === null || toggle === undefined) {
            return this.buildResponse(false, {
                message: locale.admincp.errors.ajaxRequiredParametersMissing,
            });
        }

        await UtilHelper.updateMenuCategoryToggle(category, toggle);
        return this.buildResponse(true, {});
    }
}

module.exports = AjaxHelper;