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
 * NextBoard calendar permissions.
 */
const CalendarPermissions = Object.freeze({
    VIEW: 'view',
    ADD_EVENT: 'addEvent',
    DELETE_EVENT: 'deleteEvent',
    EDIT_EVENT: 'editEvent',
    VIEW_EVENT: 'viewEvent',
});

module.exports = CalendarPermissions;