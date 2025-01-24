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

/**
 * Model for the bulletin board index.
 */
class IndexModel {
    /**
     * Returns a new instance of IndexModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Build the index of the bulletin board.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @returns {Object} The resulting vars object instance.
     */
    buildIndex(req, res) {
        return this.vars;
    }
}

module.exports = IndexModel;