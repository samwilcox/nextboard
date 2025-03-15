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

const GlobalsService = require('../../services/globalsService');
const AdminCPGlobalsService = require('../services/globalsService');
const ForumManagementModel = require('../models/forumManagementModel');

/**
 * Controller for the managing forum related tasks.
 */
class ForumManagementController {
    /**
     * Returns a new instance of ForumManagementController.
     */
    constructor() {
        this.model = new ForumManagementModel();
    }

    /**
     * Manage bulletin board features.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async manageFeatures(req, res, next) {
        try {
            const vars = await this.model.manageFeatures();
            const globals = await GlobalsService.get(req);
            const adminCPGlobals = await AdminCPGlobalsService.get(req);
            res.render('admincp/forumManagement/manage-features', { layout: 'admincp/layout', ...globals, ...adminCPGlobals, ...vars });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ForumManagementController;