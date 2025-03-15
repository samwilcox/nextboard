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
const CalendarModel = require('../models/calendarModel');

/**
 * Controller for the calendar.
 */
class CalendarController {
    /**
     * Returns a new instance of CalendarController.
     */
    constructor() {
        this.model = new CalendarModel();
    }

    /**
     * The calendar index.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Object} next - The next middleware to execute.
     */
    async index(req, res, next) {
        try {
            const vars = await this.model.buildCalendarIndex(req);
            const globals = await GlobalsService.get(req, res);
            res.render('calendar/index', { layout: 'layout', ...globals, ...vars });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CalendarController;