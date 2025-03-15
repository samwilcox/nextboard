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

const CacheProviderFactory = require("../data/cache/cacheProviderFactory");
const GroupRepository = require("../repository/groupRepository");

/**
 * GroupHelper contains helpers for handling group-related tasks.
 */
class GroupHelper {
    /**
     * Get the groups.
     * 
     * @returns {Object[]} An object containing the group entities.
     */
    static getGroups() {
        const cache = CacheProviderFactory.create();
        const groups = cache.get('user_groups')
            .map(group => GroupRepository.getGroupById(parseInt(group.id, 10)))
            .filter(group => group.getDisplay())
            .sort((a, b) => a.getSortOrder() - b.getSortOrder());

        return groups;
    }
}

module.exports = GroupHelper;