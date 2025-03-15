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

const indexRoutes = require('./indexRoutes');
const ajaxRoutes = require('./ajaxRoutes');
const forumManagementRoutes = require('./forumManagementRoutes');

/**
 * Setup all the routes for NextBoard Administrator Control Panel.
 * 
 * @param {Express} app - The Express object instance. 
 */
const setupAdminCPRoutes = (app) => {
    app.use('/admincp', indexRoutes);
    app.use('/admincp/ajax', ajaxRoutes);
    app.use('/admincp/forummanagement', forumManagementRoutes);
};

module.exports = setupAdminCPRoutes;