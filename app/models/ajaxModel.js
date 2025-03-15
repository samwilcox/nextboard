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

const AjaxHelper = require('../helpers/ajaxHelper');
const ForumsHelper = require('../helpers/forumsHelper');
const LocaleHelper = require('../helpers/localeHelper');
const UtilHelper = require('../helpers/utilHelper');
const WhosOnlineHelper = require('../helpers/whosOnlineHelper');

/**
 * Model for AJAX tasks.
 */
class AjaxModel {
    /**
     * Returns a new instance of AjaxModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Like/Unlike content.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing JSON data.
     */
    async likeUnlikeContent(req) {
        return AjaxHelper.likeUnlikeContent(req);
    }

    /**
     * Get the list of available emoticons.
     * 
     * @param {Object} req - The request object.
     * @returns {Object} An object containing JSON data. 
     */
    async emoticons(req) {
        const { category } = req.params;
        
        if (category) {
            return AjaxHelper.getEmoticons(category);
        } else {
            return AjaxHelper.getEmoticons();
        }
    }

    /**
     * Takes a Rumble ID and then returns the embed ID.
     * 
     * @param {Object} req - The request object from Express.
     */
    async rumbleProxy(req) {
        const rumble = await AjaxHelper.getRumbleEmbedId(req);

        if (!rumble) {
            return AjaxHelper.buildResponse(false, {
                message: LocaleHelper.get('errors', 'rumbleEmbedIdFailed'),
            })
        }

        return AjaxHelper.buildResponse(true, { id: rumble });
    }

    /**
     * Search for tags.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing JSON data.
     */
    async searchForTags(req) {
        return AjaxHelper.searchTags(req);
    }

    /**
      * Upload a file.
      * 
      * @param {Object} req - The request object from Express.
      * @returns {Object} An object containing JSON data.
      */
    async uploadFile(req) {
        return await AjaxHelper.uploadFile(req);
    }

    /**
     * Delete an uploaded file.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing JSON data.
     */
    async deleteUploadedFile(req) {
        return await AjaxHelper.deleteUploadedFile(req);
    }

    /**
     * Get the specified poll option template.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the JSON data.
     */
    async pollOptions(req) {
        return await AjaxHelper.pollOptions(req);
    }

    /**
     * Cast a vote in the given poll.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the JSON data.
     */
    async castPoll(req) {
        return await AjaxHelper.castPoll(req);
    }
}

module.exports = AjaxModel;