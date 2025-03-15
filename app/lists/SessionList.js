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
 * List of all sessions used by NextBoard.
 */
const SessionList = Object.freeze({
    AUTH_TOKEN: 'NextBoard_Member_Auth_Token',
    SIGNIN_ERROR: 'NextBoard_SignIn_Error',
    FILTERS: 'NextBoard_Filters',
});

module.exports = SessionList;