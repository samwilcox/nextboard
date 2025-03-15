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
const PostModel = require('../models/postModel');

/**
 * Controller for the posting.
 */
class PostController {
    /**
     * Returns a new instance of PostController.
     */
    constructor() {
        this.model = new PostModel();
    }

    /**
     * Posts a new reply to a topic.
     *  
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async postReplyToTopic(req, res, next) {
        try {
            await this.model.postReplyToTopic(req, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PostController;