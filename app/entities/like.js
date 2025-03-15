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

const DateTimeHelper = require("../helpers/dateTimeHelper");
const OutputHelper = require("../helpers/outputHelper");
const memberService = require("../services/memberService");

/**
 * An entity that represents a single like.
 */
class Like {
    /**
     * Creates a new instance of Like.
     */
    constructor() {
        this.id = null;
        this.contentType = null;
        this.contentId = null;
        this.memberId = null;
        this.likedAt = null;
    }

    /**
     * Get the like identifier.
     * 
     * @returns {number} The like identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the like identifier.
     * 
     * @param {number} id - The like identifier. 
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the content type that was liked.
     * 
     * @returns {string} The content type (e.g., post).
     */
    getContentType() {
        return this.contentType;
    }

    /**
     * Set the content type that was liked.
     * 
     * @param {string} contentType - The content type (e.g., post).
     */
    setContentType(contentType) {
        this.contentType = contentType;
    }

    /**
     * Get the identifier of the content that was liked.
     * 
     * @returns {number} The content identifier (e.g., post ID).
     */
    getContentId() {
        return this.contentId;
    }

    /**
     * Set the identifier of the content that was liked.
     * 
     * @param {number} contentId - The content identifier (e.g., post ID).
     */
    setContentId(contentId) {
        this.contentId = contentId;
    }

    /**
     * Get the member identifier who liked the content.
     * 
     * @returns {number} The member identifier.
     */
    getMemberId() {
        return this.memberId;
    }

    /**
     * Set the member identifier who liked the content.
     * 
     * @param {number} memberId - The member identifier.
     */
    setMemberId(memberId) {
        this.memberId = memberId;
    }

    /**
     * Get the timestamp when the like occurred.
     * 
     * @returns {Date} The date and time when the like occurred.
     */
    getLikedAt() {
        return this.likedAt;
    }

    /**
     * Set the timestamp when the like occurred.
     * 
     * @param {Date} likedAt - The date and time when the like occurred.
     */
    setLikedAt(likedAt) {
        this.likedAt = likedAt;
    }

    /**
     * Builds the entity component.
     * 
     * @returns {string} The entity component source.
     */
    async build() {
        const member = memberService.getMemberById(this.getMemberId());

        return OutputHelper.getPartial('likeEntity', 'entity', {
            photo: await member.profilePhoto({ type: 'thumbnail', url: true }),
            link: member.link(),
            timestamp: DateTimeHelper.dateFormatter(this.getLikedAt(), { timeAgo: true }),
        });
    }
}

module.exports = Like;