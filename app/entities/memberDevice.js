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
 * Entity that represents a single member device.
 */
class MemberDevice {
    /**
     * Creates a new instance of MemberDevice.
     */
    constructor() {
        this.id = null;
        this.memberId = null;
        this.token = null;
        this.userAgent = null;
        this.lastUsedAt = null;
    }

    /**
     * Get the device session hash.
     * 
     * @returns {string} The device session hash.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the device session hash.
     * 
     * @param {string} id - The device session hash.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the member ID associated with the device.
     * 
     * @returns {number} The member ID.
     */
    getMemberId() {
        return this.memberId;
    }

    /**
     * Set the member ID associated with the device.
     * 
     * @param {number} memberId - The member ID.
     */
    setMemberId(memberId) {
        this.memberId = memberId;
    }

    /**
     * Get the authentication token for the device.
     * 
     * @returns {string} The authentication token.
     */
    getToken() {
        return this.token;
    }

    /**
     * Set the authentication token for the device.
     * 
     * @param {string} token - The authentication token.
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Get the user agent string of the device.
     * 
     * @returns {string} The user agent string.
     */
    getUserAgent() {
        return this.userAgent;
    }

    /**
     * Set the user agent string of the device.
     * 
     * @param {string} userAgent - The user agent string.
     */
    setUserAgent(userAgent) {
        this.userAgent = userAgent;
    }

    /**
     * Get the timestamp of the last usage of the device.
     * 
     * @returns {Date} The last used timestamp.
     */
    getLastUsedAt() {
        return this.lastUsedAt;
    }

    /**
     * Set the timestamp of the last usage of the device.
     * 
     * @param {Date} lastUsedAt - The last used timestamp.
     */
    setLastUsedAt(lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
}

module.exports = MemberDevice;