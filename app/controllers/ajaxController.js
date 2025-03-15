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

const AjaxModel = require('../models/ajaxModel');
const { upload } = require('../helpers/uploadHelper');

/**
 * Controller for AJAX tasks.
 */
class AjaxController {
    /**
     * Returns a new instance of AjaxController.
     */
    constructor() {
        this.model = new AjaxModel();
    }

    /**
     * Like/Unlike content.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async like(req, res) {
        try {
            const data = await this.model.likeUnlikeContent(req);
            res.json(data);
        } catch (error) {
            console.error('Error liking/unliking content:', error);
            res.status(500).json({ success: false, message: 'Failed to like/unlike content' });
        }
    }

    /**
     * Get the list of available emoticons.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async emoticons(req, res) {
        try {
            const data = await this.model.emoticons(req);
            res.json(data);
        } catch (error) {
            console.error('Error fetching emoticons:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch emoticons' });
        }
    }

    /**
     * Takes the Rumble ID and returns the embed code.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async rumbleProxy(req, res) {
        try {
            const data = await this.model.rumbleProxy(req);
            res.json(data);
        } catch (error) {
            console.error('Error fetching Rumble embed identifier:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch Rumble embed identifier' });
        }
    }

    /**
     * Search for current tags.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async searchTags(req, res) {
        try {
            const data = await this.model.searchForTags(req);
            res.json(data);
        } catch (error) {
            console.error('Error searching for tags:', error);
            res.status(500).json({ success: false, message: 'Failed to search for tags' });
        }
    }

    /**
     * Uploads a file.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async uploadFile(req, res) {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
    
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
    
            try {  
                const data = await this.model.uploadFile(req);
                res.json(data);
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ success: false, message: 'Failed to upload file' });
            }
        });
    }

    /**
     * Delete an uploaded file.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async deleteUploadedFile(req, res) {
        try {
            const data = await this.model.deleteUploadedFile(req);
            res.json(data);
        } catch (error) {
            console.error('Error deleting uploaded file:', error);
            res.status(500).json({ success: false, message: 'Failed to delete uploaded file' });
        }
    } 

    /**
     * Get the specified poll option template.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async pollOptions(req, res) {
        try {
            const data = await this.model.pollOptions(req);
            res.json(data);
        } catch (error) {
            console.error('Error retrieving poll option:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve poll option' });
        }
    }

    /**
     * Cast a vote in a poll.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express. 
     */
    async castPoll(req, res) {
        try {
            const data = await this.model.castPoll(req);
            res.json(data);
        } catch (error) {
            console.error('Error casting poll:', error);
            res.status(500).json({ success: false, message: 'Failed to cast poll' });
        }
    }
}

module.exports = AjaxController;