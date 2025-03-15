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

const AuthHelper = require('../helpers/authHelper');
const LocaleHelper = require('../helpers/localeHelper');
const SessionHelper = require('../helpers/sessionHelper');
const UtilHelper = require('../helpers/utilHelper');
const SessionList = require('../lists/SessionList');

/**
 * Model for authenticating members.
 */
class AuthModel {
    /**
     * Returns a new instance of ForumModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the vars.
     */
    async signInPage(req) {
        UtilHelper.selectMenuItem('forums');
        UtilHelper.initializeBreadcrumbs();
        UtilHelper.addBreadcrumb(LocaleHelper.get('auth', 'signInBreadcrumbTitle'), UtilHelper.buildUrl(['auth', 'signin']));

        if (SessionHelper.exists(req, SessionList.SIGNIN_ERROR)) {
            this.vars.signInErrorBox = UtilHelper.buildErrorBox(SessionHelper.get(req, SessionList.SIGNIN_ERROR), { display: true });
            SessionHelper.delete(req, SessionList.SIGNIN_ERROR);
        } else {
            this.vars.signInErrorBox = null;
        }

        this.vars.urls = {
            action: UtilHelper.buildUrl(['auth', 'signin']),
            forgotPassword: UtilHelper.buildUrl(['auth', 'forgotpassword']),
        };

        this.vars.referer = UtilHelper.getReferer(req);

        return this.vars;
    }

    /**
     * Process the sign in request.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async processSignIn(req, res) {
        const { identity, password, rememberMe, referer } = req.body;
        const validate = AuthHelper.validateCredentials(identity, password);

        if (!validate.success) {
            this.handleError(req, res, validate.data.message);
        }

        AuthHelper.completeSignIn(req, res, validate.data.member, { rememberMe, url: referer });
    }

    /**
     * Handles any sign in errors.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {string} message - The error message.
     */
    handleError(req, res, message) {
        SessionHelper.set(req, SessionList.SIGNIN_ERROR, message);
        res.redirect(UtilHelper.buildUrl(['auth', 'signin']));
    }

    /**
     * Sign out the member.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async signOutMember(req, res) {
        await AuthHelper.signOut(req ,res);
    }
}

module.exports = AuthModel;