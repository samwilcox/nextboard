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
 * An entity that represents a single Session.
 */
class Session {
    /**
     * Returns a new instance of Session.
     */
    constructor() {
        this.id = null;
        this.memberId = null;
        this.expires = null;
        this.lastClick = null;
        this.location = null;
        this.ipAddress = null;
        this.hostname = null;
        this.userAgent = null;
        this.displayOnWo = false;
        this.isBot = false;
        this.botName = null;
        this.isAdmin = false;
    }

    /**
     * Get the session identifier.
     * 
     * @returns {string|null} The session identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the session identifier.
     * 
     * @param {string} id - The session identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the member ID associated with the session.
     * 
     * @returns {string|null} The member ID.
     */
    getMemberId() {
        return this.memberId;
    }

    /**
     * Set the member ID associated with the session.
     * 
     * @param {string} memberId - The member ID.
     */
    setMemberId(memberId) {
        this.memberId = memberId;
    }

    /**
     * Get the session expiration time.
     * 
     * @returns {Date|null} The expiration time.
     */
    getExpires() {
        return this.expires;
    }

    /**
     * Set the session expiration time.
     * 
     * @param {Date} expires - The expiration time.
     */
    setExpires(expires) {
        this.expires = expires;
    }

    /**
     * Get the last click time in the session.
     * 
     * @returns {Date|null} The last click time.
     */
    getLastClick() {
        return this.lastClick;
    }

    /**
     * Set the last click time in the session.
     * 
     * @param {Date} lastClick - The last click time.
     */
    setLastClick(lastClick) {
        this.lastClick = lastClick;
    }

    /**
     * Get the location associated with the session.
     * 
     * @returns {string|null} The location.
     */
    getLocation() {
        return this.location;
    }

    /**
     * Set the location associated with the session.
     * 
     * @param {string} location - The location.
     */
    setLocation(location) {
        this.location = location;
    }

    /**
     * Get the IP address associated with the session.
     * 
     * @returns {string|null} The IP address.
     */
    getIpAddress() {
        return this.ipAddress;
    }

    /**
     * Set the IP address associated with the session.
     * 
     * @param {string} ipAddress - The IP address.
     */
    setIpAddress(ipAddress) {
        this.ipAddress = ipAddress;
    }

    /**
     * Get the hostname associated with the session.
     * 
     * @returns {string|null} The hostname.
     */
    getHostname() {
        return this.hostname;
    }

    /**
     * Set the hostname associated with the session.
     * 
     * @param {string} hostname - The hostname.
     */
    setHostname(hostname) {
        this.hostname = hostname;
    }

    /**
     * Get the user agent associated with the session.
     * 
     * @returns {string|null} The user agent.
     */
    getUserAgent() {
        return this.userAgent;
    }

    /**
     * Set the user agent associated with the session.
     * 
     * @param {string} userAgent - The user agent.
     */
    setUserAgent(userAgent) {
        this.userAgent = userAgent;
    }

    /**
     * Get the displayOnWo flag indicating whether the session should display on the website.
     * 
     * @returns {boolean} The displayOnWo flag.
     */
    getDisplayOnWo() {
        return this.displayOnWo;
    }

    /**
     * Set the displayOnWo flag indicating whether the session should display on the website.
     * 
     * @param {boolean} displayOnWo - The displayOnWo flag.
     */
    setDisplayOnWo(displayOnWo) {
        this.displayOnWo = displayOnWo;
    }

    /**
     * Get the isBot flag indicating whether the session is associated with a bot.
     * 
     * @returns {boolean} The isBot flag.
     */
    getIsBot() {
        return this.isBot;
    }

    /**
     * Set the isBot flag indicating whether the session is associated with a bot.
     * 
     * @param {boolean} isBot - The isBot flag.
     */
    setIsBot(isBot) {
        this.isBot = isBot;
    }

    /**
     * Get the bot name associated with the session, if it is a bot.
     * 
     * @returns {string|null} The bot name.
     */
    getBotName() {
        return this.botName;
    }

    /**
     * Set the bot name associated with the session, if it is a bot.
     * 
     * @param {string} botName - The bot name.
     */
    setBotName(botName) {
        this.botName = botName;
    }

    /**
     * Get the isAdmin flag indicating whether the session is associated with an admin.
     * 
     * @returns {boolean} The isAdmin flag.
     */
    getIsAdmin() {
        return this.isAdmin;
    }

    /**
     * Set the isAdmin flag indicating whether the session is associated with an admin.
     * 
     * @param {boolean} isAdmin - The isAdmin flag.
     */
    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }
}

module.exports = Session;