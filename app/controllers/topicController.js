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
const TopicModel = require('../models/topicModel');

/**
 * Controller for viewing topics.
 */
class TopicController {
    /**
     * Returns a new instance of TopicController.
     */
    constructor() {
        this.model = new TopicModel();
    }

    /**
     * Displays the selected topic.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async viewTopic(req, res, next) {
        try {
            const vars = await this.model.viewTopic(req, res);
            const globals = await GlobalsService.get(req, res);
            res.render('topic/view', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TopicController;