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
const ForumsHelper = require('../helpers/forumsHelper');
const MemberRepository = require('../repository/memberRepository');
const MemberService = require('./memberService');
const ForumPermissions = require('../types/forumPermissions');
const ForumPermissionRepository = require('../repository/forumPermissionRepository');
const UtilHelper = require('../helpers/utilHelper');

/**
 * Service that handles various bulletin board permissions.
 */
class PermissionsService {
    static instance = null;

    /**
     * Get the singleton instance of PermissionsService.
     * 
     * @returns {PermissionsService} The singleton instance of PermissionsService.
     */
    static getInstance() {
        if (!PermissionsService.instance) {
            PermissionsService.instance = new PermissionsService();
        }

        return PermissionsService.instance;
    }

    /**
     * Get the permissions for a given feature.
     * This could also return false if the feature is currenty 'disabled'.
     * 
     * @param {string} featureName - The name of the feature to get permissions for.
     * @returns {boolean} True if the user has permissions, false if the user does not have permissions or feature is disabled.
     */
    getFeaturePermission(featureName) {
        // TODO: Uncomment below.
        return true;

        // const member = MemberService.getMember();
        // const cache = CacheProviderFactory.create();
        // const data = cache.get('feature_permissions').find(feature => feature.featureName === featureName);
        // const exists = data ? true : false;

        // if (!exists) return false;
        // if (data.enabled === 0) return false;

        // const allowedUsers = data.allowedUsers ? JSON.parse(data.allowedUsers) : null;
        // const allowedGroups = data.allowedGroups ? JSON.parse(data.allowedGroups) : null;

        // const isInUsers = allowedUsers.find(user => user === member.getId()) ? true : false;

        // if (isInUsers) return true;

        // const isInGroups = allowedGroups.find(group => group === member.getPrimaryGroup().getId()) ? true : false;

        // if (isInGroups) return true;

        // if (member.getSecondaryGroups() && member.getSecondaryGroups().length > 0) {
        //     member.getSecondaryGroups().forEach(group => {
        //         const inGroup = allowedGroups.find(g => g === group.getId()) ? true : false;
        //         if (inGroup) return true;
        //     });
        // }

        // return false;
    }

    /**
     * Get the permissions for multiple given features.
     * 
     * @param {string[]} featureNames - An array of feature names to get permissions for.
     * @returns {Object} An object with key-value pairs for each permission results by its feature name.
     */
    getFeaturePermissions(featureNames) {
        if (!featureNames || !Array.isArray(featureNames)) {
            throw new Error('featureNames must be an array');
        }

        const permissions = {};

        featureNames.forEach(permission => {
            permissions[permission] = this.getFeaturePermission(permission);
        });

        return permissions;
    }

    /**
     * Check if a user has valid permissions to the given forum permission.
     * 
     * @param {number} forumId - The forum identifier to check permission on.
     * @param {string} permission - The name of the permission to check.
     * @param {number} [memberId=null] - Optional member identifier (default is current member). 
     */
    hasForumPermission(forumId, permission, memberId = null) {
        // TODO: This is temporary.
        return true;

        // const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();

        // if (!ForumsHelper.forumExists(forumId)) {
        //     return false;
        // }

        // const permissions = ForumPermissionRepository.getForumPermissionByForumId(forumId);

        // if (!permission) return false;

        // const permission = permissions[`get${UtilHelper.firstLetterToUppercase(permission)}`]();
        // const members = permission.members;
        // const groups = permission.groups;

        // if (members && Array.isArray(members) && members.length > 0) {
        //     users.forEach(mbr => {
        //         if (mbr === member.getId()) return true;
        //     });
        // }

        // if (groups && Array.isArray(groups) && groups.length > 0) {
        //     groups.forEach(group => {
        //         if (group === member.getPrimaryGroup().getId()) return true;

        //         const secondaryGroups = member.getSecondaryGroups();

        //         if (secondaryGroups && Array.isArray(secondaryGroups) && secondaryGroups.length > 0) {
        //             secondaryGroups.forEach(sec => {
        //                 if (group === sec.getid()) return true;
        //              });
        //         }
        //     });
        // }

        // return false;
    }

    /**
     * Get the forum permissions for the given member and permissions.
     * 
     * @param {number} forumId - The forum identifier to check permission on.
     * @param {string[]} permissions - An array of permissions to retreive. 
     * @param {number} [memberId=null] - Optional member identifier (default is current member).
     * @returns {Object} An object with key-value pairs for each permission requested. 
     */
    hasForumPermissions(forumId, permissions, memberId = null) {
        const perms = {};

        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
            permissions.forEach(permission => {
                perms[permission] = this.hasForumPermission(forumId, permission, memberId);
            });
        }

        return perms;
    }
}

module.exports = PermissionsService.getInstance();