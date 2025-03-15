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
const CreateModel = require('../models/createModel');

/**
 * Controller for creating content.
 */
class CreateController {
    /**
     * Returns a new instance of CreateController.
     */
    constructor() {
        this.model = new CreateModel();
    }

    /**
     * Displays the create new topic form.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     * @param {Object} next - The next middleware to execute.
     */
    async createTopicForm(req, res, next) {
        try {
            const vars = await this.model.createTopicForm(req);
            const globals = await GlobalsService.get(req, res);
            res.render('create/topic-form', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Process the new topic.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     * @param {Object} next - The next middleware to execute.
     */
    async processNewTopic(req, res, next) {
        try {
            await this.model.processNewTopic(req, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CreateController;