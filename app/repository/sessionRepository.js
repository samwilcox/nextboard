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
 * SessionRepository is responsible for handling and retrieval and construction of 'Session' entity.
 */
class SessionRepository {
    /**
     * Fetch a session's raw data by ID from the cache.
     * 
     * @param {number} sessionId - The session identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadSessionDataById(sessionId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('sessions').find(session => session.id === sessionId);
        return data || null;
    }

    /**
     * Build a 'Session' entity from raw data.
     * 
     * @param {Object} data - The raw session data. 
     * @param {number} sessionId - The session identifier.
     * @returns {Session|null} The constructed 'Session' entity or null if data is invalid.
     */
    static buildSessionFromData(data, sessionId) {
        const Session = require('../entities/session');
        const session = new Session();
        session.setId(data ? data.id : sessionId);
        return session;
    }

    /**
     * Get the 'Session' entity by ID.
     * 
     * @param {number} sessionId - The group identifier.
     * @returns {Session|null} The 'Session' entity or null if not found.
     */
    static getSessionById(sessionId) {
        const data = this.loadSessionDataById(sessionId);
        return this.buildSessionFromData(data, sessionId);
    }
}

module.exports = SessionRepository;