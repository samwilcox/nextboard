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

const UtilHelper = require("../helpers/utilHelper");

/**
 * GlobalsService is a service that builds all the global data.
 */
class GlobalsService {
    static instance = null;

    /**
     * Get the singleton instance of GlobalsService.
     * 
     * @returns {GlobalsService} The singleton instance of GlobalsService.
     */
    static getIntance() {
        if (!GlobalsService.instance) {
            GlobalsService.instance = new GlobalsService();
        }

        return GlobalsService.instance;
    }

    /**
     * Creates a new instance of GlobalsService.
     */
    constructor() {
        this.globals = {};
    }

    /**
     * Get the AdminCP globals.
     * 
     * @returns {Object} An object containing all the AdminCP globals.
     */
    async get(req) {
        this.globals.menu = await UtilHelper.convertMenuData(await UtilHelper.getMenuSettings());

        this.globals.__urls = {
            general: {
                dashboard: UtilHelper.buildUrl(),
            },
            forumManagement: {
                manageForums: UtilHelper.buildUrl(['forummanagement', 'manageforums']),
                manageFeatures: UtilHelper.buildUrl(['forummanagement', 'managefeatures']),
            }
        };

        return this.globals;
    } 
}

module.exports = GlobalsService.getIntance();