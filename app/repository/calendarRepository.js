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

const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * CalendarRepository is responsible for handling and retrieval and construction of 'Calendar' entity.
 */
class CalendarRepository {
    /**
     * Fetch a calendar's raw data by ID from the cache.
     * 
     * @param {number} calendarId - The calendar identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadCalendarDataById(calendarId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('calendars').find(calendar => calendar.id === parseInt(calendarId, 10));
        return data || null;
    }

    /**
     * Build a 'Calendar' entity from raw data.
     * 
     * @param {Object} data - The raw calendar event data. 
     * @param {number} calendarId - The calendar identifier.
     * @returns {Calendar|null} The constructed 'Calendar' entity or null if data is invalid.
     */
    static buildCalendarFromData(data, calendarId) {
        const Calendar = require('../entities/calendar');
        const calendar = new Calendar();

        if (!data) return null;
        
        calendar.setId(data.id ? data.id : calendarId);
        calendar.setTitle(data.title);
        calendar.setDescription(data.description);
        calendar.setType(data.type);
        calendar.setCreatedBy(parseInt(data.createdBy, 10));
        calendar.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));
        calendar.setAssignedTo(data.assignedTo ? JSON.parse(data.assignedTo) : null);
        calendar.setPermissions(JSON.parse(data.permissions));
        calendar.setSharedWith(data.sharedWith ? JSON.parse(data.sharedWith) : null);

        return calendar;
    }

    /**
     * Get the 'Calender' entity by ID.
     * 
     * @param {number} calendarId - The calendar identifier.
     * @returns {Calendar|null} The 'Calendar' entity or null if not found.
     */
    static getCalendarById(calendarId) {
        const data = this.loadCalendarDataById(calendarId);
        return this.buildCalendarFromData(data, calendarId);
    }
}

module.exports = CalendarRepository;