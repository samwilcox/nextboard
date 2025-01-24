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
const IndexModel = require('../models/indexModel');

/**
 * Controller for the index of NextBoard.
 */
class IndexController {
    /**
     * Returns a new instance of IndexController.
     */
    constructor() {
        this.model = new IndexModel();
    }

    /**
     * Builds the index of NextBoard.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async buildIndex(req, res) {
        const vars = this.model.buildIndex(req, res);
        const globals = GlobalsService.get(req);
        res.render('home/index', { layout: 'layout', ...globals, ...vars });
    }
}

module.exports = IndexController;