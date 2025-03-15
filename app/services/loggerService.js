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

const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * Service for logging information, warnings, errors, etc.
 */
class LoggerService {
    static instance = null;

    /**
     * Get the singleton instance of LoggerService.
     * 
     * @returns {LoggerService} The singleton instance of LoggerService.
     */
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }

        return LoggerService.instance;
    }

    /**
     * Log admin activity.
     * 
     * @param {number} adminId - The identifier of the admin user.
     * @param {number} targetId - The target id.
     * @param {string} action - The action that was taken.
     * @param {string} details - The details of the activity.
     * @param {string} ip - The IP address of the admin user. 
     */
    async logAdminActivity(adminId, targetId, action, details, ip) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('admin_logs', [
                'adminId', 'action', 'targetId', 'details', 'ipAddress', 'createdAt'
            ], [
                adminId, action, targetId, details, ip, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('admin_logs');
    }

    /**
     * Log moderation activity.
     * 
     * @param {number} moderatorId - The identifier of the moderator user.
     * @param {string} action - The action that was taken.
     * @param {number} forumId - The identifier of the affected forum.
     * @param {number} targetId - The identifier of the target.
     * @param {string} details - Details of the activity.
     * @param {string} ip - The IP address of the moderator user.
     */
    async logModerationActivity(moderatorId, action, forumId, targetId, details, ip) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('moderation_logs', [
                'moderatorId', 'action', 'forumId', 'targetId', 'details', 'ipAddress', 'createdAt'
            ], [
                moderatorId, action, forumId, targetId, details, ip, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('moderation_logs');
    }

    /**
     * Log user activity.
     * 
     * @param {number} memberId - The identifier of the member.
     * @param {string} action - The action that was taken.
     * @param {string} details - The details of the action taken.
     * @param {string} ip - The IP address of the member.
     */
    async logUserActivity(memberId, action, details, ip) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('user_activity_logs', [
                'memberId', 'action', 'details', 'ipAddress', 'createdAt'
            ], [
                memberId, action, details, ip, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('user_activity_logs');
    }

    /**
     * Log a security event.
     * 
     * @param {number} memberId - The identifier of the member.
     * @param {string} event - Details of the event.    
     * @param {string} status - The status of the event ('success', 'failed', or 'blocked'). 
     * @param {string} ip - The IP address of the user. 
     * @param {string} userAgent - The user agent of the user.
     */
    async logSecurityEvent(memberId, event, status, ip, userAgent) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('security_logs', [
                'memberId', 'event', 'status', 'ipAddress', 'userAgent', 'createdAt'
            ], [
                memberId, event, status, ip, userAgent, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('security_logs');
    }

    /**
     * Log an error.
     * 
     * @param {string} errorType - The type of error.
     * @param {string} message - The error message.
     * @param {string} file - The file where the error occured.
     * @param {number} line - The line number of the affected code.
     * @param {string} stackTrace - The stack trace for the error.
     */
    async logError(errorType, message, file, line, stackTrace) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('error_logs', [
                'errorType', 'message', 'file', 'line', 'stackTrace', 'createdAt'
            ], [
                errorType, message, file, line, stackTrace, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('error_logs');
    }

    /**
     * Log content modification.
     * 
     * @param {number} memberId - The identifier of the member that changed content.
     * @param {string} action - The action taken.
     * @param {string} contentType - The type of content modified ('post', 'topic', or 'comment').
     * @param {number} contentId - The content identifier.
     * @param {string} oldValue - The old value.
     * @param {string} newValue - The new value.
     */
    async logContent(memberId, action, contentType, contentId, oldValue, newValue) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('content_logs', [
                'memberId', 'action', 'contentType', 'contentId', 'oldValue', 'newValue', 'createdAt'
            ], [
                memberId, action, contentType, contentId, oldValue, newValue, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('content_logs');
    }

    /**
     * Log access activity.
     * 
     * @param {number} memberId - The identifier of the member.
     * @param {string} url - The URL that is being accessed.
     * @param {string} referrer - The referrer URL.
     * @param {string} ip - The IP address of the user.
     * @param {string} userAgent - The user agent of the user.
     * @param {string} status - The status of the event ('success', 'notfound', or 'forbidden').
     */
    async logAccess(memberId, url, referrer, ip, userAgent, status) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .insertInto('access_logs', [
                'memberId', 'url', 'referrer', 'ipAddress', 'userAgent', 'status', 'createdAt'
            ], [
                memberId, url, referrer, ip, userAgent, status, DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('access_logs');
    }
}

module.exports = LoggerService.getInstance();