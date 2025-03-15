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
const ProfileModel = require('../models/profileModel');

/**
 * Controller for displaying the member profiles.
 */
class ProfileController {
    /**
     * Returns a new instance of ProfileController.
     */
    constructor() {
        this.model = new ProfileModel();
    }

    /**
     * Builds the member's profile.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async buildProfile(req, res, next) {
        try {
            const vars = await this.model.buildProfile(req, res);
            const globals = await GlobalsService.get(req, res);
            res.render('profile/index', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProfileController;