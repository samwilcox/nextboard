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

const GlobalsService = require('../services/globalsService');
const ForumModel = require('../models/forumModel');

/**
 * Controller for displaying a forum.
 */
class ForumController {
    /**
     * Returns a new instance of ForumController.
     */
    constructor() {
        this.model = new ForumModel();
    }

    /**
     * Displays the selected forum.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async displayForum(req, res, next) {
        try {
            const vars = await this.model.displayForum(req, res);
            const globals = await GlobalsService.get(req, res);
            res.render('forum/index', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ForumController;