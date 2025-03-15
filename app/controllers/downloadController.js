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
const DownloadModel = require('../models/downloadModel');

/**
 * Controller for downloading files.
 */
class DownloadController {
    /**
     * Returns a new instance of DownloadController.
     */
    constructor() {
        this.model = new DownloadModel();
    }

    /**
     * Download a selected file.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     * @param {Object} next - The next middleware to execute.
     */
    async downloadAttachment(req, res, next) {
        try {
            await this.model.downloadAttachment(req, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DownloadController;