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

/**
 * An entity that represents a single calendar.
 */
class Calendar {
    /**
     * Creates a new instance of Calendar.
     */
    constructor() {
        this.id = null;
        this.title = null;
        this.description = null;
        this.type = null;
        this.createdBy = null;
        this.createdAt = null;
        this.assignedTo = null;
        this.permissions = null;
        this.sharedWith = null;
    }

    /**
     * Get the calendar idenfitier.
     * 
     * @returns {number} The calendar identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the calendar identifier.
     * 
     * @param {number} id - The calendar identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the calendar title.
     * 
     * @returns {string} The calendar title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the calendar title.
     * 
     * @param {string} title - The calendar title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the calendar description.
     * 
     * @returns {string} The calendar description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Set the calendar description.
     * 
     * @param {string} description - The calendar description.
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Get the calendar type.
     * 
     * @returns {string} The calendar type.
     */
    getType() {
        return this.type;
    }

    /**
     * Set the calendar type.
     * 
     * @param {string} type - The calendar type.
     */
    setType(type) {
        this.type = type;
    }

    /**
     * Get the creator of the calendar.
     * 
     * @returns {number} The ID of the user who created the calendar.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * Set the creator of the calendar.
     * 
     * @param {number} createdBy - The ID of the user who created the calendar.
     */
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get the creation timestamp of the calendar.
     * 
     * @returns {Date} The timestamp when the calendar was created.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the creation timestamp of the calendar.
     * 
     * @param {Date} createdAt - The timestamp when the calendar was created.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the assigned user or group.
     * 
     * @returns {number|string} The ID of the assigned user or group.
     */
    getAssignedTo() {
        return this.assignedTo;
    }

    /**
     * Set the assigned user or group.
     * 
     * @param {number|string} assignedTo - The ID of the assigned user or group.
     */
    setAssignedTo(assignedTo) {
        this.assignedTo = assignedTo;
    }

    /**
     * Get the calendar permissions.
     * 
     * @returns {object} The calendar permissions.
     */
    getPermissions() {
        return this.permissions;
    }

    /**
     * Set the calendar permissions.
     * 
     * @param {object} permissions - The calendar permissions.
     */
    setPermissions(permissions) {
        this.permissions = permissions;
    }

    /**
     * Get the list of users the calendar is shared with.
     * 
     * @returns {Array<number>} The list of user IDs.
     */
    getSharedWith() {
        return this.sharedWith;
    }

    /**
     * Set the list of users the calendar is shared with.
     * 
     * @param {Array<number>} sharedWith - The list of user IDs.
     */
    setSharedWith(sharedWith) {
        this.sharedWith = sharedWith;
    }
}

module.exports = Calendar;