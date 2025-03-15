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
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const LikeRepository = require('../repository/likeRepository');
const MemberRepository = require('../repository/memberRepository');
const MemberService = require('../services/memberService');
const DateTimeHelper = require('./dateTimeHelper');
const OutputHelper = require('./outputHelper');
const UtilHelper = require('./utilHelper');

/**
 * Helpers for liking content.
 */
class LikeHelper {
    /**
     * Get whether the given member has liked the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is current member).
     * @returns {boolean} True if the member has liked the content, false if they have not. 
     */
    static hasLikedContent(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();

        return cache.get('liked_content')
            .find(like =>
                like.contentType === contentType &&
                like.contentId === contentId &&
                like.memberId === member.getId()
            ) ? true : false;
    }

    /**
     * Get the total likes for the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @returns {number} The total likes.
     */
    static getTotalLikes(contentType, contentId) {
        const cache = CacheProviderFactory.create();

        return cache.get('liked_content')
            .filter(like =>
                like.contentType === contentType &&
                like.contentId === contentId
            ).length;
    }

    /**
     * Get the dialog listing of all the people that liked the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @returns {string} The dialog showing the people who liked the given content.
     */
    static async getLikeListing(contentType, contentId) {
        const cache = CacheProviderFactory.create();

        const likePromises = cache.get('liked_content').map(like => 
            LikeRepository.getLikeById(parseInt(like.id, 10))
        );

        const allLikes = await Promise.all(likePromises);

        const filteredLikes = allLikes
            .filter(like => like.getContentType() === contentType && like.getContentId() === parseInt(contentId, 10))
            .sort((a, b) => b.getLikedAt() - a.getLikedAt());

        const likeData = (await Promise.all(filteredLikes.map(like => like.build()))).join('');

        return OutputHelper.getPartial('likeHelper', 'dialog', {
            contentType,
            contentId,
            likes: likeData,
        });
    }

    /**
     * Like the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is current member).
     * @returns {boolean} True if successful, false if not.
     */
    static async likeContent(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (this.hasLikedContent(contentType, contentId, member.getId())) return false;

        try {
            await db.query(builder
                .clear()
                .insertInto('liked_content', [
                    'contentType', 'contentId', 'memberId', 'likedAt'
                ], [
                    contentType,
                    contentId,
                    member.getId(),
                    DateTimeHelper.dateToEpoch(new Date()),
                ])
                .build()
            );
    
            await cache.update('liked_content');
        } catch (error) {
            console.error(`Failed to like the given content: (Content Type: ${contentType}, Content ID: ${contentId}):`, error);
            return false;
        }

        return true;
    }

    /**
     * Unlike the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @param {number} [memberId=null] - Optional member identifier (default is current member).
     * @returns {boolean} True if successful, false if not.
     */
    static async unlikeContent(contentType, contentId, memberId = null) {
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (!this.hasLikedContent(contentType, contentId, member.getId())) return false;

        try {
            await db.query(builder
                .clear()
                .deleteFrom('liked_content')
                .where('contentType = ? AND contentId = ? and memberId = ?', [
                    contentType,
                    contentId,
                    member.getId()
                ])
                .build()
            );
    
            await cache.update('liked_content');
        } catch (error) {
            console.error(`Failed to unlike the given content: (Content Type: ${contentType}, Content ID: ${contentId}):`, error);
            return false;
        }

        return true;
    }

    /**
     * Build the like button for the given content.
     * 
     * @param {"topic":"post"} contentType - The content type (e.g., 'topic', 'post').
     * @param {number} contentId - The content identifier.
     * @returns {string} The like button source.
     */
    static async getLikeButtonForContent(contentType, contentId) {
        UtilHelper.registerDialog(await this.getLikeListing(contentType, contentId), { overwrite: true });
        const member = MemberService.getMember();

        return OutputHelper.getPartial('likeHelper', 'button', {
            hasLiked: this.hasLikedContent(contentType, contentId),
            totalLikes: UtilHelper.formatNumber(this.getTotalLikes(contentType, contentId)),
            contentType,
            contentId,
            signedIn: member.isSignedIn(),
        });
    }
}

module.exports = LikeHelper;