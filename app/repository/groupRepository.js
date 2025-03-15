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

const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * GroupRepository is responsible for handling and retrieval and construction of 'Group' entity.
 */
class GroupRepository {
    /**
     * Fetch a group's raw data by ID from the cache.
     * 
     * @param {number} groupId - The group identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadGroupDataById(groupId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('user_groups').find(group => group.id === parseInt(groupId, 10));
        return data || null;
    }

    /**
     * Build a 'Group' entity from raw data.
     * 
     * @param {Object} data - The raw group data. 
     * @param {number} groupId - The group identifier.
     * @returns {Group|null} The constructed 'Group' entity or null if data is invalid.
     */
    static buildGroupFromData(data, groupId) {
        const Group = require('../entities/group');
        const group = new Group();
        
        group.setId(data ? data.id : groupId);
        group.setSortOrder(parseInt(data.sortOrder, 10));
        group.setName(data && data.name ? data.name : null);
        group.setDescription(data && data.description ? data.description : null);
        group.setCreatedAt(DateTimeHelper.epochToDate(data.createdAt));
        group.setColor(data && data.color ? data.color : null);
        group.setEmphasize(data && data.emphasize ? parseInt(data.emphasize, 10) === 1 : false);
        group.setDisplay(data && data.display ? parseInt(data.display, 10) === 1 : false);
        group.setModerator(data && data.isModerator ? parseInt(data.isModerator, 10) === 1 : false);
        group.setAdmin(data && data.isAdmin ? parseInt(data.isAdmin, 10) === 1 : false);
        group.setCanBeModified(parseInt(data.canBeModified, 10) === 1);
        group.setCanBeDeleted(parseInt(data.canBeDeleted, 10) === 1);

        return group;
    }

    /**
     * Get the 'Group' entity by ID.
     * 
     * @param {number} groupId - The group identifier.
     * @returns {Group|null} The 'Group' entity or null if not found.
     */
    static getGroupById(groupId) {
        const data = this.loadGroupDataById(groupId);
        return this.buildGroupFromData(data, groupId);
    }
}

module.exports = GroupRepository;