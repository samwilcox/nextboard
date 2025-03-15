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
const MemberRepository = require("../repository/memberRepository");
const UtilHelper = require("./utilHelper");
const RegistryService = require('../services/registryService');
const DateTimeHelper = require("./dateTimeHelper");

/**
 * StatisticsHelper contains helpers for statistic-related operations.
 */
class StatisticsHelper {
    /**
     * Builds and then returns the statistics for the BBIC.
     * 
     * @returns {Object} An object containing the statistics.
     */
    static getBBICStatistics() {
        const statistics = {};
        const cache = CacheProviderFactory.create();
        const data = cache.getAll({
            categories: 'categories',
            forums: 'forums',
            topics: 'topics',
            posts: 'posts',
            members: 'members',
        });

        statistics.totalCategories = UtilHelper.formatNumber(data.categories.length);
        statistics.totalForums = UtilHelper.formatNumber(data.forums.length);
        statistics.totalTopics = UtilHelper.formatNumber(data.topics.length);
        statistics.totalPosts = UtilHelper.formatNumber(data.posts.length);
        statistics.totalMembers = UtilHelper.formatNumber(data.members.length);

        const members = data.members.map(member => MemberRepository.getMemberById(parseInt(member.id, 10)));
        members.sort((a, b) => b.getJoined() - a.getJoined());
        const newestMember = members[0];

        statistics.newestMember = {
            link: newestMember.link(),
            timestamp: DateTimeHelper.dateFormatter(newestMember.getJoined(), { timeAgo: true }),
        };

        const mostUsers = RegistryService.get('mostUsers');

        statistics.mostOnline = {
            total: UtilHelper.formatNumber(mostUsers.total),
            timestamp: DateTimeHelper.dateFormatter(mostUsers.timestamp, { timeAgo: true }),
        };

        return statistics;
    }
}

module.exports = StatisticsHelper;