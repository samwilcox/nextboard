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
 * GlobalsService that handles all global data.
 */
class GlobalsService {
    static instance = null;

    /**
     * Returns a new instance of GlobalsService.
     */
    constructor() {
        this.globals = {};
    }

    /**
     * Get the singleton instance of GlobalsService.
     * 
     * @returns {GlobalsService} The singleton instance of GlobalsService.
     */
    static getInstance() {
        if (!GlobalsService.instance) {
            GlobalsService.instance = new GlobalsService();
        }

        return GlobalsService.instance;
    }

    /**
     * Get all the global data.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The globals object instance.
     */
    get(req) {
        return this.globals;
    }
}

module.exports = GlobalsService.getInstance();