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

const setupRoutes = require('../routes');
const setupAdminCPRoutes = require('../admincp/routes');

/**
 * Set up all the application routes for NextBoard.
 * 
 * @param {Express} app - The express object instance. 
 */
module.exports = (app) => {
    try {
        setupRoutes(app);
        setupAdminCPRoutes(app);
        console.log('Application routes setup.');
    } catch (error) {
        console.error(`Failed to setup the application routes: ${error}`);
    }
};