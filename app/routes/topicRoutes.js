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
const TopicController = require('../controllers/topicController');

const topicController = new TopicController();

router.get('/:topicId/:slug', topicController.viewTopic.bind(topicController));
router.get('/:topicId/:slug/page/:page', topicController.viewTopic.bind(topicController));

module.exports = router;