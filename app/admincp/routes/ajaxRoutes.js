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

router.post('/menu/category/toggle', ajaxController.updateMenuCategoryToggle.bind(ajaxController));

module.exports = router;