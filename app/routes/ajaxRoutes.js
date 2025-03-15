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

const express = require('express');
const router = express.Router();
const AjaxController = require('../controllers/ajaxController');

const ajaxController = new AjaxController();

router.post('/like', ajaxController.like.bind(ajaxController));
router.get('/emoticons', ajaxController.emoticons.bind(ajaxController));
router.get('/emoticons/:category', ajaxController.emoticons.bind(ajaxController));
router.get('/rumbleproxy', ajaxController.rumbleProxy.bind(ajaxController));
router.get('/tags/search', ajaxController.searchTags.bind(ajaxController));
router.post('/upload', ajaxController.uploadFile.bind(ajaxController));
router.post('/deletefile', ajaxController.deleteUploadedFile.bind(ajaxController));
router.get('/poll/item', ajaxController.pollOptions.bind(ajaxController));
router.post('/poll/cast', ajaxController.castPoll.bind(ajaxController));

module.exports = router;