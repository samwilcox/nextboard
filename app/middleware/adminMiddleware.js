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

const UtilHelper = require("../admincp/helpers/utilHelper");

/**
 * Middleware for the Administrator Control Panel.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const adminMiddleware = async (req, res, next) => {
    try {
        await UtilHelper.manageSelectedMenuItems(req.path);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = adminMiddleware;