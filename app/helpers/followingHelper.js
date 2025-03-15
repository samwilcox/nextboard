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
const MemberRepository = require('../repository/memberRepository');
const MemberService = require('../services/memberService');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require('./dateTimeHelper');

/**
 * Helpers for following content.
 */
class FollowingHelper {
    /**
     * Check if a member is following the given content.
     * 
     * @param {string} contentType - The content type string (e.g., 'forum', 'topic', etc).
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is the current member). 
     * @returns {boolean} True if the member is following the given content, false if they are not.
     */
    static isFollowing(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();
        return cache.get('followed_content')
            .find(follow =>
                follow.contentType === contentType &&
                follow.contentId === contentId &&
                follow.memberId === member.getId()
            ) ? true : false;
    }

    /**
     * Get the total number of members following the given content.
     * 
     * @param {string} contentType - The content type string (e.g., 'forum', 'topic', etc).
     * @param {number} contentId - The content identifier.
     * @returns {number} The total members following the given content.
     */
    static getTotalFollowing(contentType, contentId) {
        const cache = CacheProviderFactory.create();
        return cache.get('followed_content')
            .filter(follow =>
                follow.contentType === contentType &&
                follow.contentId === contentId
            ).length;
    }

    /**
     * Follow the given content.
     * 
     * @param {string} contentType - The content type string (e.g., 'forum', 'topic', etc).
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is the current member). 
     */
    static async followContent(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (this.isFollowing(contentType, contentId, member.getId())) return;

        await db.query(builder
            .clear()
            .insertInto('followed_content', [
                'contentType', 'contentId', 'memberId', 'followedAt'
            ], [
                contentType,
                contentId,
                member.getId(),
                DateTimeHelper.dateToEpoch(new Date()),
            ])
            .build()
        );

        await cache.update('followed_content');
    }

    /**
     * Unfollow the given content.
     * 
     * @param {string} contentType - The content type string (e.g., 'forum', 'topic', etc).
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is current member). 
     */
    static async unfollowContent(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (!this.isFollowing(contentType, contentId, member.getId())) return;

        await db.query(builder
            .clear()
            .deleteFrom('followed_content')
            .where('contentType = ? AND contentId = ? AND memberId = ?', [
                contentType, contentId, member.getId()
            ])
            .build()
        );

        await cache.update('followed_content');
    }
}

module.exports = FollowingHelper;