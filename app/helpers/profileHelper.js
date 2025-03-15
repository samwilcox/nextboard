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
const DatabaseProviderFactory = require("../data/db/databaseProviderFactory");
const QueryBuilder = require("../data/db/queryBuilder");
const MemberRepository = require("../repository/memberRepository");
const Settings = require('../settings');
const DateTimeHelper = require("./dateTimeHelper");
const MemberService = require('../services/memberService');
const LocaleHelper = require("./localeHelper");
const UtilHelper = require("./utilHelper");

/**
 * Helpers for profile-related tasks.
 */
class ProfileHelper {
    /**
     * Get the limited profile visitors data.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {Object} An object containing the limited list of visitors and the complete total.
     */
    static async getLimitedProfileVisitors(memberId) {
        const cache = CacheProviderFactory.create();
        const visitors = cache.get('profile_visitors')
            .filter(visitor => visitor.memberId === parseInt(memberId, 10))
            .sort((a, b) => a.visitedAt - b.visitedAt);

        const total = visitors.length;

        if (total === 0) {
            return {
                haveVisitors: false,
                total: 0,
            };
        }

        const maxVisitorsListing = Settings.get('maxProfileVisitorsListing');
        const forDisplay = visitors.slice(0, maxVisitorsListing - 1);
        const list = [];

        if (forDisplay && Array.isArray(forDisplay) && forDisplay.length > 0) {
            for (const visitor of forDisplay) {
                const member = MemberRepository.getMemberById(parseInt(visitor.visitingMemberId, 10));

                list.push({
                    photo: await member.profilePhoto({ type: 'thumbnail', url: true }),
                    link: member.link(),
                    timestamp: DateTimeHelper.dateFormatter(parseInt(visitor.visitedAt, 10), { timeAgo: true }),
                });
            }

            return {
                haveVisitors: true,
                visitors: list,
                total,
                totalLocalized: LocaleHelper.replace('profileHelper', `totalProfileViews${total === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(total)),
            };
        }

        return {
            haveVisitors: false,
            total: 0,
        };
    }

    /**
     * Adds a new profile new to the member's profile views.
     * If the member has already viewed the profile, then their view timestamp is updated.
     * If the member has not yet viewed the profile, then a new record is inserted.
     * If the member viewing the profile is the member of the profile, no new record is added.
     * 
     * @param {number} memberId - The member identifier.
     */
    static async addNewProfileView(memberId) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        const member = MemberService.getMember();
        const data = cache.get('profile_visitors').find(visitor => visitor.memberId === parseInt(memberId, 10) && visitor.visitingMemberId === member.getId());
        const exists = data ? true : false;

        if (member.getId() !== memberId && member.isSignedIn() && member.getId() > 0) {
            if (exists) {
                await db.query(builder
                    .clear()
                    .update('profile_visitors')
                    .set(['visitedAt'], [DateTimeHelper.dateToEpoch(new Date())])
                    .where('id = ?', [data.id])
                    .build()
                );
    
                await cache.update('profile_visitors');
            } else {
                await db.query(builder
                    .clear()
                    .insertInto('profile_visitors', [
                        'memberId', 'visitingMemberId', 'visitedAt'
                    ], [
                        memberId, member.getId(), DateTimeHelper.dateToEpoch(new Date())
                    ])
                    .build()
                );

                await cache.update('profile_visitors');
            }
        }
    }
}

module.exports = ProfileHelper;