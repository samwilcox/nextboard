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

const moment = require('moment');
const CalendarRepository = require('../repository/calendarRepository');
const LocaleHelper = require('./localeHelper');
const CalendarPermissions = require('../types/calendarPermissions');
const MemberService = require('../services/memberService');
const Settings = require('../settings');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const OutputHelper = require('./outputHelper');

/**
 * Helpers for managing the calendar.
 */
class CalendarHelper {
    /**
     * Generate a calendar month grid.
     * 
     * @param {number} year - The year of the calendar.
     * @param {number} month - The month of the calendar (1-12).
     * @param {Array} events - An array of events, where each event has a startDate.
     * @returns {Array} A 2D array representing the month grid.
     */
    static generateMonthGrid(year, month, events = []) {
        const adjustedMonth = month - 1;
        const firstDay = moment({ year, month: adjustedMonth, day: 1 });
        const lastDay = moment(firstDay).endOf('month');
        const totalDays = lastDay.date();
        const startDayOfTheWeek = firstDay.day();
        let grid = [];
        let dayCounter = 1;

        for (let i = 0; i < 6; i++) {
            let week = new Array(7).fill(null);

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startDayOfTheWeek) {
                    week[j] = null;
                } else if (dayCounter > totalDays) {
                    week[j] = null;
                } else {
                    let dayEvents = events.filter(event =>
                        moment(event.startDate).isSame(moment({ year, month: adjustedMonth, day: dayCounter }), 'day')
                    );

                    week[j] = {
                        day: dayCounter,
                        events: dayEvents,
                    };

                    dayCounter++;
                }
            }

            grid.push(week);

            if (dayCounter > totalDays) break;
        }

        return grid;
    }

    /**
     * Check if a user has valid permission to the given permission for the given calendar.
     * 
     * @param {number} calendarId - The calendar identifier.
     * @param {CalendarPermissions} permission - The permission to check.
     * @returns {Object} An object containg the permission result and the corresponding error message (is any).
     */
    static havePermission(calendarId, permission) {
        const calendar = CalendarRepository.getCalendarById(calendarId);

        if (!calendar) {
            return {
                valid: false,
                message: LocaleHelper.get('errors', 'calendarDoesNotExistPermission'),
            };
        }

        const permissions = calendar.getPermissions();

        switch (permission) {
            case CalendarPermissions.VIEW:
                const viewPermissions = permissions[CalendarPermissions.VIEW];

                if (!viewPermissions.enabled) {
                    return {
                        valid: true,
                        message: null,
                    };
                }

                if (this.checkUserAndGroupsForPermission(viewPermissions.users, viewPermissions.groups)) {
                    return {
                        valid: true,
                        message: null,
                    };
                } else {
                    return {
                        valid: false,
                        message: LocaleHelper.get('errors', 'invalidCalendarViewPermissions'),
                    };
                }
            case CalendarPermissions.ADD_EVENT:
                const addEventPermissions = permissions[CalendarPermissions.ADD_EVENT];

                if (!addEventPermissions.enabled) {
                    return {
                        valid: true,
                        message: null,
                    };
                }

                if (this.checkUserAndGroupsForPermission(addEventPermissions.users, addEventPermissions.groups)) {
                    return {
                        valid: true,
                        message: null,
                    };
                } else {
                    return {
                        valid: false,
                        message: LocaleHelper.get('errors', 'invalidCalendarAddEventPermissions'),
                    };
                }
            case CalendarPermissions.DELETE_EVENT:
                const deleteEventPermissions = permissions[CalendarPermissions.DELETE_EVENT];

                if (!deleteEventPermissions.enabled) {
                    return {
                        valid: true,
                        message: null,
                    };
                }

                if (this.checkUserAndGroupsForPermission(deleteEventPermissions.users, deleteEventPermissions.groups)) {
                    return {
                        valid: true,
                        message: null,
                    };
                } else {
                    return {
                        valid: false,
                        message: LocaleHelper.get('errors', 'invalidCalendarDeleteEventPermissions'),
                    };
                }
            case CalendarPermissions.EDIT_EVENT:
                const editEventPermissions = permissions[CalendarPermissions.EDIT_EVENT];

                if (!editEventPermissions.enabled) {
                    return {
                        valid: true,
                        message: null,
                    };
                }

                if (this.checkUserAndGroupsForPermission(editEventPermissions.users, editEventPermissions.groups)) {
                    return {
                        valid: true,
                        message: null,
                    };
                } else {
                    return {
                        valid: false,
                        message: LocaleHelper.get('errors', 'invalidCalendarEditEventPermissions'),
                    };
                }   
            case CalendarPermissions.VIEW_EVENT:
                const viewEventPermissions = permissions[CalendarPermissions.VIEW_EVENT];

                if (!viewEventPermissions.enabled) {
                    return {
                        valid: true,
                        message: null,
                    };
                }

                if (this.checkUserAndGroupsForPermission(viewEventPermissions.users, viewEventPermissions.groups)) {
                    return {
                        valid: true,
                        message: null,
                    };
                } else {
                    return {
                        valid: false,
                        message: LocaleHelper.get('errors', 'invalidCalendarViewEventPermissions'),
                    };
                }
            default:
                return {
                    valid: false,
                    message: LocaleHelper.replace('errors', 'invalidCalendarPermissionType', 'permission', permission),
                };
        }
    }

    /**
     * Check if an user has valid permissions for the given calendar.
     * 
     * @param {number} calendarId - The calendar identifier.
     * @param {CalendarPermissions[]} permissions - An array of permissions to check.
     * @returns {Object} An object containing key-value pairs with each permission name as key and value for the result. 
     */
    static havePermissions(calendarId, permissions) {
        const results = {};

        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
            permissions.forEach(permission => {
                results[permission] = this.havePermission(calendarId, permission);
            });
        }

        return results;
    }

    /**
     * Helper that checks if the user has permission for the given users and group lists.
     * 
     * @param {number[]} users - An array of users that have permissions. 
     * @param {number[]} groups - An array of groups that have permissions.
     * @returns {boolean} True if has valid permissions, false if not. 
     */
    static checkUserAndGroupsForPermission(users, groups) {
        const member = MemberService.getMember();
        const adminGroupId = Settings.get('administratorGroupId');

        // First, if the user is an admin, they do not need to be in the list as the
        // default admin group has access to everything
        if (member.getPrimaryGroup().getId() === adminGroupId) {
            return true;
        }

        const secondaryGroups = member.getSecondaryGroups();

        if (secondaryGroups && Array.isArray(secondaryGroups) && secondaryGroups.length > 0) {
            secondaryGroups.forEach(group => {
                if (group.getId() === adminGroupId) {
                    return true;
                }
            });
        }

        if (users && Array.isArray(users) && users.length > 0) {
            users.forEach(user => {
                if (user === member.getId()) {
                    return true;
                }
            });
        }

        if (groups && Array.isArray(groups) && groups.length > 0) {
            groups.forEach(group => {
                if (group === member.getPrimaryGroup().getId()) {
                    return true;
                }

                if (secondaryGroups && Array.isArray(secondaryGroups) && secondaryGroups.length > 0) {
                    secondaryGroups.forEach(secGroup => {
                        if (group === secGroup) {
                            return true;
                        }
                    });
                }
            });
        }

        return false;
    }

    /**
     * Get a complete list of all the current calendars.
     * 
     * @returns {Calendar[]} - An array of all the current calendars.
     */
    static getAllCalendars() {
        const member = MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const data = cache.get('calendars').map(calendar => CalendarRepository.getCalendarById(calendar.id));
        const calendars = [];

        data.forEach(calendar => {
            if (calendar.getType() === 'private') {
                if (calendar.getCreatedBy() === member.getId()) calendars.push(calendar);
            } else {
                if (this.havePermission(calendar.getId(), CalendarPermissions.VIEW)) calendars.push(calendar);
            }
        });

        calendars.sort((a, b) => a.getTitle().localeCompare(b.getTitle()));

        return calendars;
    }

    /**
     * Build the calendar header source HTML.
     * 
     * @param {number} calendarId - The calendar identifier.
     * @param {string} [selectedView='monthly'] - The selected calendar view ('monthly', 'weekly', or 'daily').
     * @returns {string} The calendar header HTML source. 
     */
    static buildCalendarHeader(calendarId, selectedView = 'monthly') {
        const calendar = CalendarRepository.getCalendarById(calendarId);

        return OutputHelper.getPartial('calendarHelper', 'header', {
            calendars: this.getAllCalendars(),
            calendar,
        });
    }

    /**
     * Parse and validate a given date value.
     * 
     * @param {number} value - The input value (could be year, month, or day).
     * @param {"month" |"day"|"year"} [type='year'] - The type of value to parse and validate ('year', 'month', or 'day').
     * @returns {Object} An object containing the validation result,the parsed value and error message (if any). 
     */
    static parseAndValidate(value, type = 'year') {
        if (!value) {
            return {
                validated: false,
                message: LocaleHelper.get('errors', 'missingInputForParseValidationCalendar'),
            };
        }

        const regex = {
            year: /^[0-9]{4}$/,
            month: /^(0[1-9]|1[0-2])$/,
            day: /^(0[1-9]|[12][0-9]|3[01])$/,
        };

        if (type === 'month' && value.toString().length === 1) {
            if (typeof value === 'string') {
                value = `0${value}`;
            } else {
                value = `0${value.toString()}`;
            }
        }

        if (!regex[type]) {
            return {
                validated: false,
                message: LocaleHelper.replace('errors', 'invalidDateTypeCalendar', 'type', type),
            };
        }

        if (!regex[type].test(value)) {
            return {
                validated: false,
                message: LocaleHelper.replaceAll('errors', 'invalidTypeForCalendar', {
                    type,
                    value: parseInt(value, 10),
                }),
            };
        }

        return {
            validated: true,
            value: parseInt(value, 10),
            message: null,
        };
    }
}

module.exports = CalendarHelper;