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

const UtilHelper = require("../helpers/utilHelper");

/**
 * An entity that represents a single calendar event.
 */
class CalendarEvent {
    /**
     * Creates a new instance of CalendarEvent.
     */
    constructor() {
        this.id = null;
        this.calendarId = null;
        this.title = null;
        this.description = null;
        this.startDate = null;
        this.endDate = null;
        this.recurrence = null;
        this.eventType = null;
        this.createdBy = null;
        this.createdAt = null;
    }

    /**
     * Get the calendar event identifier.
     * 
     * @returns {number} The calendar event identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the calendar event identifier.
     * 
     * @param {number} id - The calendar event identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the calendar identifier this event belongs to.
     * 
     * @returns {number} The calendar identifier this event belongs to.
     */
    getCalendarId() {
        return this.calendarId;
    }

    /**
     * Set the calendar identifier this event belongs to.
     * 
     * @param {number} calendarId - The calendar identifier this event belongs to.
     */
    setCalendarId(calendarId) {
        this.calendarId = calendarId;
    }

    /**
     * Get the calendar event title.
     * 
     * @returns {string} The event title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the calendar event title.
     * 
     * @param {string} title - The event title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the calendar event description.
     * 
     * @returns {string} The event description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Set the calendar event description.
     * 
     * @param {string} description - The event description.
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Get the event start date.
     * 
     * @returns {Date} The event start date.
     */
    getStartDate() {
        return this.startDate;
    }

    /**
     * Set the event start date.
     * 
     * @param {Date} startDate - The event start date.
     */
    setStartDate(startDate) {
        this.startDate = startDate;
    }

    /**
     * Get the event end date.
     * 
     * @returns {Date} The event end date.
     */
    getEndDate() {
        return this.endDate;
    }

    /**
     * Set the event end date.
     * 
     * @param {Date} endDate - The event end date.
     */
    setEndDate(endDate) {
        this.endDate = endDate;
    }

    /**
     * Get the event recurrence pattern.
     * 
     * @returns {string} The event recurrence pattern.
     */
    getRecurrence() {
        return this.recurrence;
    }

    /**
     * Set the event recurrence pattern.
     * 
     * @param {string} recurrence - The event recurrence pattern.
     */
    setRecurrence(recurrence) {
        this.recurrence = recurrence;
    }

    /**
     * Get the event type.
     * 
     * @returns {string} The event type.
     */
    getEventType() {
        return this.eventType;
    }

    /**
     * Set the event type.
     * 
     * @param {string} eventType - The event type.
     */
    setEventType(eventType) {
        this.eventType = eventType;
    }

    /**
     * Get the event creator ID.
     * 
     * @returns {number} The event creator ID.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * Set the event creator ID.
     * 
     * @param {number} createdBy - The event creator ID.
     */
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get the event creation timestamp.
     * 
     * @returns {Date} The event creation timestamp.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the event creation timestamp.
     * 
     * @param {Date} createdAt - The event creation timestamp.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the URL to this calendar event.
     * 
     * @returns {string} The URL web address to this calendar event.
     */
    url() {
        return `${UtilHelper.buildUrl(['calendar', 'event'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getTitle())}`;
    }
}

module.exports = CalendarEvent;