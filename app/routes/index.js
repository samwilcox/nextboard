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

const Settings = require('../settings');
const indexRoutes = require('./indexRoutes');

/**
 * Setup all the routes for NextBoard.
 * 
 * @param {Express} app - The Express object instance. 
 */
const setupRoutes = (app) => {
    app.use((req, res, next) => {
        req.settings = Settings.getAll();
        next();
    });

    app.use('/', indexRoutes);
};

module.exports = setupRoutes;