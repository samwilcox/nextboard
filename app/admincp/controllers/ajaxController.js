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

const AjaxModel = require('../models/ajaxModel');

/**
 * Controller for AJAX requests.
 */
class AjaxController {
    /**
     * Returns a new instance of AjaxController.
     */
    constructor() {
        this.model = new AjaxModel();
    }

    /**
     * Updates the menu category toggle state.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async updateMenuCategoryToggle(req, res) {
        res.json(await this.model.updateMenuCategoryToggle(req));
    }
}

module.exports = AjaxController;