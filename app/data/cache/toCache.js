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
 * Returns the list of all database tables that should be cached.
 * 
 * @returns {string[]} An array of all the database tables to cache.
 */
const toCache = () => {
    return [
        'sessions',
        'members',
        'settings',
        'locales',
        'themes',
        'user_groups',
        'widgets',
        'categories',
        'forums',
        'topics',
        'posts',
        'tags',
        'content_tracker',
        'member_photos',
        'feature_permissions',
        'followed_content',
        'liked_content',
        'forum_clicks',
        'access_logs',
        'admin_logs',
        'content_logs',
        'error_logs',
        'moderation_logs',
        'security_logs',
        'user_activity_logs',
        'member_devices',
        'calendars',
        'calendar_events',
        'profile_visitors',
        'registry',
        'member_attachments',
        'member_cover_photos',
        'content_views_tracker',
        'menu_tracker'
    ];
};

module.exports = toCache;