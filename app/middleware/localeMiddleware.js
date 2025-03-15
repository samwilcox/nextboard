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

const LocaleHelper = require('../helpers/localeHelper');
const DataStoreService = require('../services/dataStoreService');

/**
 * Middleware for initializing the locale.
 * 
 * @param {Express} app - The Express application instance.
 */
const localeMiddleware = (app) => {
    return async (req, res, next) => {
        try {
            req.app = app;
            DataStoreService.set('request', req);
            DataStoreService.set('response', res);

            try {
                LocaleHelper.initialize(req.member);
                req.locale = LocaleHelper.getAll();
            } catch (error) {
                const message = `Failed to initialize the locale: ${error}`;
                console.error(message);
                return next(new Error(message));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = localeMiddleware;