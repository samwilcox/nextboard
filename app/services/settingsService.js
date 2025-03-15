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
const UtilHelper = require('../helpers/utilHelper');

/**
 * Initialize the application settings.
 */
module.exports = () => {
    try {
        Settings.initialize();
        UtilHelper.initializeBreadcrumbs();
        console.log('Application settings initialized.');
    } catch (error) {
        console.error(`Failed to initialize application settings: ${error}`);
        throw error;
    }
};