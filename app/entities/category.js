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

const UtilHelper = require('../helpers/utilHelper');
const OutputHelper = require('../helpers/outputHelper');

/**
 * An entity that represents a single category.
 */
class Category {
    /**
     * Creates a new instance of Category.
     */
    constructor() {
        this.id = null;
        this.title = null;
        this.sortOrder = null;
        this.createdAt = null;
        this.visible = false;
    }

    /**
     * Get the category identifier.
     * 
     * @returns {number} The category identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the category identifier.
     * 
     * @param {number} id - The category identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the category title.
     * 
     * @returns {string} The category title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the category title.
     * 
     * @param {string} title - The category title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the category sort order.
     * 
     * @returns {number} The sort order.
     */
    getSortOrder() {
        return this.sortOrder;
    }

    /**
     * Set the category sort order.
     * 
     * @param {number} sortOrder - The sort order.
     */
    setSortOrder(sortOrder) {
        this.sortOrder = sortOrder;
    }

    /**
     * Get the category creation timestamp.
     * 
     * @returns {Date} The creation timestamp.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the category creation timestamp.
     * 
     * @param {Date} createdAt - The creation timestamp.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Check if the category is visible.
     * 
     * @returns {boolean} True if visible, otherwise false.
     */
    isVisible() {
        return this.visible;
    }

    /**
     * Set the category visibility.
     * 
     * @param {boolean} visible - The visibility status.
     */
    setVisible(visible) {
        this.visible = visible;
    }

    /**
     * Returns the URL web address to this category.
     * 
     * @returns {string} The URL web address to this category.
     */
    url() {
        return `${UtilHelper.buildUrl(['category'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getTitle())}`;
    }

    /**
     * Builds the entity.
     * 
     * @param {boolean} [footer=false] - True to build the header, false to build the footer.
     * @returns {string} The built source.
     */
    build(footer = false) {
        if (footer) {
            return OutputHelper.getPartial('categoryEntity', 'entity-footer');
        } else {
            return OutputHelper.getPartial('categoryEntity', 'entity-header', {
                id: this.getId(),
                title: this.getTitle(),
                url: this.url(),
            });
        }
    }
}

module.exports = Category;