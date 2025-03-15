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

const path = require('path');

/**
 * Middleware for setting up the view engine.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const viewEngineMiddleware = (req, res, next) => {
    try {
        const member = req.member;
        const app = req.app;
        app.set('view engine', 'ejs');
        app.set('views', member.getConfigs().themePath);

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = viewEngineMiddleware;