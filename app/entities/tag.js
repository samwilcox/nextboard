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
 * An entity that represents a single Tag.
 */
class Tag {
    /**
     * Create a new instance of Tag.
     */
    constructor() {
        this.id = null;
        this.title = null;
        this.createdBy = null;
        this.createdAt = null;
        this.creator = null; // <- member entity object
    }

    /**
     * Get the tag identifier.
     * 
     * @returns {number} The tag identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the tag identifier.
     * 
     * @param {number} id - The tag identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the title of the tag.
     * 
     * @returns {string} The title of the tag.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the title of the tag.
     * 
     * @param {string} title - The title of the tag.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the creator identifier.
     * 
     * @returns {number} The creator identifier.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * Set the creator identifier.
     * 
     * @param {number} createdBy - The creator identifier.
     */
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get the creation timestamp.
     * 
     * @returns {Date} The creation timestamp.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the creation timestamp.
     * 
     * @param {Date} createdAt - The creation timestamp.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the creator entity.
     * 
     * @returns {object} The creator member entity object.
     */
    getCreator() {
        return this.creator;
    }

    /**
     * Set the creator entity.
     * 
     * @param {object} creator - The creator member entity object.
     */
    setCreator(creator) {
        this.creator = creator;
    }

    /**
     * Get the URL web address to this tag.
     * 
     * @returns {string} The URL web address to this tag.
     */
    url() {
        return `${process.env.BASE_URL}/tags/view/${this.getId()}`;
    }
}

module.exports = Tag;