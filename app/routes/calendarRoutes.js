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
const CalendarController = require('../controllers/calendarController');

const calendarController = new CalendarController();

router.get('/', calendarController.index.bind(calendarController));
router.get('/:calendarId', calendarController.index.bind(calendarController));
router.get('/:calendarId/:year/:month', calendarController.index.bind(calendarController));
router.get('/:year/:month', calendarController.index.bind(calendarController));

module.exports = router;