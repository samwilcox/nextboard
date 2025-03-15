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
 * CalendarEventRepository is responsible for handling and retrieval and construction of 'CalendarEvent' entity.
 */
class CalendarEventRepository {
    /**
     * Fetch a calendar event's raw data by ID from the cache.
     * 
     * @param {number} calendarEventId - The calendar event identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadCalendarEventDataById(calendarEventId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('calendar_events').find(calendar => calendar.id === parseInt(calendarEventId, 10));
        return data || null;
    }

    /**
     * Build a 'Calendar' entity from raw data.
     * 
     * @param {Object} data - The raw calendar event data. 
     * @param {number} calendarEventId - The calendar event identifier.
     * @returns {CalendarEvent|null} The constructed 'CalendarEvent' entity or null if data is invalid.
     */
    static buildCalendarEventFromData(data, calendarEventId) {
        const CalendarEvent = require('../entities/calendarEvent');
        const calendarEvent = new CalendarEvent();

        if (!data) return null;
        
        calendarEvent.setId(data.id ? data.id : calendarEventId);
        calendarEvent.setCalendarId(parseInt(data.calendardId, 10));
        calendarEvent.setTitle(data.title);
        calendarEvent.setDescription(data.description);
        calendarEvent.setStartDate(DateTimeHelper.epochToDate(parseInt(data.startedDate, 10)));
        calendarEvent.setEndDate(DateTimeHelper.epochToDate(parseInt(data.endDate, 10)));
        calendarEvent.setRecurrence(data.recurrence);
        calendarEvent.setEventType(data.eventType);

        return calendarEvent;
    }

    /**
     * Get the 'CalenderEvent' entity by ID.
     * 
     * @param {number} calendarEventId - The calendar evemt identifier.
     * @returns {CalendarEvent|null} The 'CalendarEvent' entity or null if not found.
     */
    static getCalendarEventById(calendarEventId) {
        const data = this.loadCalendarEventDataById(calendarEventId);
        return this.buildCalendarEventFromData(data, calendarEventId);
    }
}

module.exports = CalendarEventRepository;