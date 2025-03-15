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
 * List of all cookies used by NextBoard.
 */
const CookieList = Object.freeze({
    AUTH_TOKEN: 'NextBoard_Member_Auth_Token',
    CONTENT_TRACKER: 'NextBoard_Content_Tracker',
    REDIRECT_TRACKER: 'NextBoard_Redirect_Tracker',
    DEVICE_ID: 'NextBoard_Device_ID',
    CONTENT_VIEWS_TRACKER: 'NextBoard_Content_Views_Tracker',
});

module.exports = CookieList;