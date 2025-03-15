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
const AuthModel = require('../models/authModel');

/**
 * Controller for authenticating members.
 */
class AuthController {
    /**
     * Returns a new instance of AuthController.
     */
    constructor() {
        this.model = new AuthModel();
    }

    /**
     * Displays the member sign in page.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute. 
     */
    async signIn(req, res, next) {
        try {
            const vars = await this.model.signInPage(req);
            const globals = await GlobalsService.get(req, res);
            res.render('auth/signin', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Process the member sign in.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     * @param {Object} next - The next middleware to execute. 
     */
    async processSignIn(req, res, next) {
        try {
            await this.model.processSignIn(req, res);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Sign out the member.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     * @param {Object} next - The next middleware to execute. 
     */
    async signOutMember(req, res, next) {
        try {
            await this.model.signOutMember(req, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;