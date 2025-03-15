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

const CalendarHelper = require("../helpers/calendarHelper");
const DateTimeHelper = require("../helpers/dateTimeHelper");
const LocaleHelper = require("../helpers/localeHelper");
const UtilHelper = require("../helpers/utilHelper");
const CalendarRepository = require("../repository/calendarRepository");
const permissionsService = require("../services/permissionsService");
const CalendarPermissions = require("../types/calendarPermissions");
const Features = require("../types/features");

/**
 * Model for the calendar.
 */
class CalendarModel {
    /**
     * Returns a new instance of CalendarModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Build the calendar index.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object of vars.
     */
    async buildCalendarIndex(req) {
        const { calendarId, year, month } = req.params;
        const member = req.member;
        let calId;

        if (calendarId) {
            calId = parseInt(calendarId, 10);
        } else {
            calId = member.getDefaultCalendarId();
        }
    
        let calendar = CalendarRepository.getCalendarById(calId);

        if (!calendar) {
            throw new Error(LocaleHelper.replace('errors', 'calendarDoesNotExist', 'id', calId));
        }

        UtilHelper.selectMenuItem('calendar');

        if (!permissionsService.getFeaturePermission(Features.CALENDAR)) {
            throw new Error(LocaleHelper.get('errors', 'invalidCalendarViewPermissions'));
        }

        const viewPermissions = CalendarHelper.havePermission(calendar.getId(), CalendarPermissions.VIEW);

        if (!viewPermissions.valid) {
            throw new Error(viewPermissions.message);
        }

        this.vars.header = CalendarHelper.buildCalendarHeader(calendar.getId());

        let actualYear;
        let actualMonth;

        if (year) {
            const validation = CalendarHelper.parseAndValidate(year, 'year');

            if (!validation.validated) {
                throw new Error(validation.message);
            }

            actualYear = validation.value;
        } else {
            actualYear = DateTimeHelper.getYear();
        }

        if (month) {
            const validation = CalendarHelper.parseAndValidate(month, 'month');

            if (!validation.validated) {
                throw new Error(validation.message);
            }

            actualMonth = validation.value;
        } else {
            actualMonth = DateTimeHelper.getMonth();
        }

        this.vars.grid = CalendarHelper.generateMonthGrid(actualYear, actualMonth);

        this.vars.current = {
            day: DateTimeHelper.getDay(),
            month: DateTimeHelper.getMonth(),
            year: DateTimeHelper.getYear(),
        };

        if (actualMonth === DateTimeHelper.getMonth() && actualYear === DateTimeHelper.getYear()) {
            this.vars.inMonth = true;
        } else {
            this.vars.inMonth = false;
        }

        this.vars.actualYear = actualYear;

        const previousAndNext = DateTimeHelper.getPreviousAndNextMonth(actualYear, actualMonth);
        this.vars.previousAndNext = previousAndNext;

        this.vars.urls = {
            day: UtilHelper.buildUrl(['calendar', 'day', actualYear, actualMonth]),
            previous: UtilHelper.buildUrl(['calendar', previousAndNext.previous.year, previousAndNext.previous.month]),
            next: UtilHelper.buildUrl(['calendar', previousAndNext.next.year, previousAndNext.next.month]),
        };

        const months = [
            LocaleHelper.get('calendar', 'january'),
            LocaleHelper.get('calendar', 'february'),
            LocaleHelper.get('calendar', 'march'),
            LocaleHelper.get('calendar', 'april'),
            LocaleHelper.get('calendar', 'may'),
            LocaleHelper.get('calendar', 'june'),
            LocaleHelper.get('calendar', 'july'),
            LocaleHelper.get('calendar', 'august'),
            LocaleHelper.get('calendar', 'september'),
            LocaleHelper.get('calendar', 'october'),
            LocaleHelper.get('calendar', 'november'),
            LocaleHelper.get('calendar', 'december')
        ];

        this.vars.monthName = months[actualMonth-1];
        this.vars.previousMonthName = months[previousAndNext.previous.month - 1];
        this.vars.nextMonthName = months[previousAndNext.next.month - 1];

        return this.vars;
     }
}

module.exports = CalendarModel;