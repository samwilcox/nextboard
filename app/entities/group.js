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

const UtilHelper = require("../helpers/utilHelper");
const OutputHelper = require('../helpers/outputHelper');

/**
 * An entity that represents a single Group.
 */
class Group {
    /**
     * Returns a new instance of Group.
     */
    constructor() {
        this.id = null;
        this.sortOrder = null;
        this.name = null;
        this.description = null;
        this.createdAt = null;
        this.color = null;
        this.emphasize = false;
        this.display = false;
        this.isModerator = false;
        this.isAdmin = false;
        this.canBeModified = false;
        this.canBeDeleted = false;
    }

    /**
     * Get the group identifier.
     * 
     * @returns {number} The group identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the group identifier.
     * 
     * @param {number} id - The group identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the group's sort order position.
     * 
     * @returns {number} The sort order position.
     */
    getSortOrder() {
        return this.sortOrder;
    }

    /**
     * Set the group's sort order position.
     * 
     * @param {number} sortOrder - The sort order position. 
     */
    setSortOrder(sortOrder) {
        this.sortOrder = sortOrder;
    }

    /**
     * Get the name of the group.
     * 
     * @returns {string} The name of the group.
     */
    getName() {
        return this.name;
    }

    /**
     * Set the name of the group.
     * 
     * @param {string} name - The name of the group.
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Get the description of the group.
     * 
     * @returns {string} The description of the group.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Set the description of the group.
     * 
     * @param {string} description - The description of the group.
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Get the creation date of the group.
     * 
     * @returns {Date} The creation date of the group.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the creation date of the group.
     * 
     * @param {Date} createdAt - The creation date of the group.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the color of the group.
     * 
     * @returns {string} The color of the group.
     */
    getColor() {
        return this.color;
    }

    /**
     * Set the color of the group.
     * 
     * @param {string} color - The color of the group.
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Get whether the group is emphasized.
     * 
     * @returns {boolean} Whether the group is emphasized.
     */
    isEmphasized() {
        return this.emphasize;
    }

    /**
     * Set the emphasize status of the group.
     * 
     * @param {boolean} emphasize - Whether the group is emphasized.
     */
    setEmphasize(emphasize) {
        this.emphasize = emphasize;
    }

    /**
     * Get whether to display the group.
     * 
     * @returns {boolean} True to display the group, false not to.
     */
    getDisplay() {
        return this.display;
    }

    /**
     * Set whether to display the group.
     * 
     * @param {boolean} display - True to display the group, false not to. 
     */
    setDisplay(display) {
        this.display = display;
    }

    /**
     * Get whether the group is a moderator.
     * 
     * @returns {boolean} Whether the group is a moderator.
     */
    isModerator() {
        return this.isModerator;
    }

    /**
     * Set the moderator status of the group.
     * 
     * @param {boolean} isModerator - Whether the group is a moderator.
     */
    setModerator(isModerator) {
        this.isModerator = isModerator;
    }

    /**
     * Get whether the group is an admin.
     * 
     * @returns {boolean} Whether the group is an admin.
     */
    isAdmin() {
        return this.isAdmin;
    }

    /**
     * Set the admin status of the group.
     * 
     * @param {boolean} isAdmin - Whether the group is an admin.
     */
    setAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

    /**
     * Get whether this group can be modified.
     * 
     * @returns {boolean} True if the group can be modified, false if it cannot.
     */
    getCanBeModified() {
        return this.canBeModified;
    }

    /**
     * Set whether this group can be modified.
     * 
     * @param {boolean} canBeModified - True if the group can be modified, false if it cannot.
     */
    setCanBeModified(canBeModified) {
        this.canBeModified = canBeModified;
    }

    /**
     * Get whether this group can be deleted.
     * 
     * @returns {boolean} True if this group can be deleted, false if it cannot.
     */
    getCanBeDeleted() {
        return this.canBeDeleted;
    }

    /**
     * Set whether this group can be deleted.
     * 
     * @param {boolean} canBeDeleted - True if this group can be deleted, false if it cannot.
     */
    setCanBeDeleted(canBeDeleted) {
        this.canBeDeleted = canBeDeleted;
    }

    /**
     * Get the URL to the group information page.
     * 
     * @returns {string} The URL web address to the group information page.
     */
    url() {
        return `${UtilHelper.buildUrl(['groups'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getName())}`;
    }

    /**
     * Get the link for the group.
     * 
     * @param {Object} [options={}] - Options for building the group link.
     * @param {boolean} [options.includeGroupColor=true] - True to include the group color, false not to.
     * @param {boolean} [options.includeGroupEmphasize=true] - True to include the group emphasize, false not to.
     * @param {string} [options.separator=null] - A separating character(s) to seperate this link from others.
     * @param {string} [options.tooltip=null] - A tooltip for the link.
     * @param {string} [options.tooltipPlacement='top'] - Where the tooltip should be placed ('top', 'left', 'right' or 'bottom').
     * @returns {string} The link source.
     */
    link(options = {}) {
        const {
            includeGroupColor = true,
            includeGroupEmphasize = true,
            separator = null,
            tooltip = null,
            tooltipPlacement = 'top',
        } = options;

        return OutputHelper.getPartial('groupEntity', 'link', {
            url: this.url(),
            name: this.getName(),
            includeGroupColor,
            includeGroupEmphasize,
            separator,
            tooltip,
            tooltipPlacement,
            groupColor: this.getColor(),
            groupEmphasize: this.isEmphasized(),
            darkenedColor: UtilHelper.generateDarkenedColor(this.getColor()),
        });
    }
}

module.exports = Group;