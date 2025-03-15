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
const SessionRepository = require("../repository/sessionRepository");
const DateTimeHelper = require("./dateTimeHelper");
const GroupHelper = require("./groupHelper");
const LocaleHelper = require("./localeHelper");
const OutputHelper = require("./outputHelper");
const UtilHelper = require("./utilHelper");

/**
 * Helpers for assisting with the "Who's Online?" feature.
 */
class WhosOnlineHelper {
    /**
     * Get the who's browsing for a given content type.
     * 
     * @param {"forum":"topic"} contentType - The content type where checking for browsing ('forum', 'topic').
     * @param {number} contentId - The content identifier. 
     * @returns {string} The browsing component source HTML.
     * @throws {Error} Throws an error if the content type is not supported.
     */
    static getBrowsingComponent(contentType, contentId) {
        const cache = CacheProviderFactory.create();
        const session = cache.get('sessions');
        let matchingSessions, list;
        const separator = OutputHelper.getPartial('whosOnlineHelper', 'separator');

        const componentData = {
            total: {
                overall: 0,
                members: 0,
                anonymous: 0,
                guests: 0,
                bots: 0,
                formatted: {
                    overall: null,
                    members: null,
                    anonymous: null,
                    guests: null,
                    bots: null,
                },
            },
            list: null,
        };

        if (contentType !== 'forum' && contentType !== 'topic') {
            throw new Error(LocaleHelper.replace('errors', 'invalidContentTypeForBrowsingComponent', 'type', contentType));
        }

        const regex = new RegExp(`^/${contentType}/(\\d+)/`);
        matchingSessions = session.filter(session => session.location.match(regex));

        if (matchingSessions && Array.isArray(matchingSessions) && matchingSessions.length > 0) {
            matchingSessions.forEach(sess => {
                const match = sess.location.match(regex);

                if (parseInt(match[1], 10) === contentId) {                    
                     if (sess.memberId === 0 && sess.displayOnWo === 0 && sess.isBot === 0) {
                        componentData.total.guests++;
                        componentData.total.overall++;
                     } else if (sess.memberId !== 0 && sess.displayOnWo == 0 && sess.isBot === 0) {
                        componentData.total.anonymous++;
                        componentData.total.overall++;
                     } else if (sess.memberId === 0 && sess.displayOnWo === 0 && session.isBot === 1) {
                        componentData.total.bots++;
                        componentData.total.overall++;

                        if (list) {
                            componentData.list += `${separator}${sessionEntity.getBotName()}`;
                        } else {
                            componentData.list = sessionEntity.getBotName();
                        }
                     } else {
                        componentData.total.members++;
                        componentData.total.overall++;
                        const member = MemberRepository.getMemberById(sess.memberId);

                        if (list) {
                            componentData.list += member.link({
                                separator,
                                tooltip: LocaleHelper.replace(
                                    'whosOnlineHelper', 'lastClickTooltip', 'time', DateTimeHelper.dateFormatter(sess.lastClick, {
                                        timeAgo: false, timeOnly: true }))
                                });
                        } else {
                            componentData.list = member.link({
                                tooltip: LocaleHelper.replace(
                                    'whosOnlineHelper', 'lastClickTooltip', 'time', DateTimeHelper.dateFormatter(sess.lastClick, {
                                        timeAgo: false, timeOnly: true }))
                            });
                        }
                     }
                }
            });
        }

        componentData.total.formatted.overall = UtilHelper.formatNumber(componentData.total.overall);
        componentData.total.formatted.members = UtilHelper.formatNumber(componentData.total.members);
        componentData.total.formatted.anonymous = UtilHelper.formatNumber(componentData.total.anonymous);
        componentData.total.formatted.guests = UtilHelper.formatNumber(componentData.total.guests);
        componentData.total.formatted.bots = UtilHelper.formatNumber(componentData.total.bots);

        const contentTypeLegend = {
            forum: LocaleHelper.get('whosOnlineHelper', 'forum'),
            topic: LocaleHelper.get('whosOnlineHelper', 'topic'),
        };

        return OutputHelper.getPartial('whosOnlineHelper', 'browsing-component', {
            viewing: LocaleHelper.replaceAll('whosOnlineHelper', `${componentData.total.overall === 1 ? 'personViewing': 'peopleViewing'}`, {
                total: componentData.total.formatted.overall,
                content: contentTypeLegend[contentType],
            }),
            total: componentData.total,
            list: componentData.list,
        });
    }

    /**
     * Get the total number of people browsing the given content.
     * 
     * @param {"forum":"topic"} contentType - The content type ('forum' or 'topic').
     * @param {number} contentId - The content identifier.
     * @returns {number} The total number of people browsing the given content.
     */
    static getTotalBrowsingContent(contentType, contentId) {
        const cache = CacheProviderFactory.create();
        const session = cache.get('sessions');
        let total = 0, matchingSessions;

        const regex = new RegExp(`^/${contentType.toLowerCase()}/(\\d+)/`);
        matchingSessions = session.filter(session => session.location.match(regex));

        if (matchingSessions && Array.isArray(matchingSessions) && matchingSessions.length > 0) {
            matchingSessions.forEach(sess => {
                const match = sess.location.match(regex);
                if (parseInt(match[1], 10) === contentId) total++;
            });
        }

        return total;
    }

    /**
     * Get the "Who's Online?" data for the BBIC component.
     * 
     * @returns {Object} The Who's Online? data object.
     */
    static getWhosOnlineData() {
        const cache = CacheProviderFactory.create();
        const session = cache.get('sessions');
        const separator = OutputHelper.getPartial('global', 'list-separator');

        const whosOnlineData = {
            total: {
                overall: 0,
                members: 0,
                anonymous: 0,
                guests: 0,
                bots: 0,
            },
            membersList: '',
            legend: null,
        };

        const groups = GroupHelper.getGroups();
        let legendData = '';

        if (groups.length > 0) {
            groups.forEach(group => {
                if (legendData.length > 0) {
                    legendData += group.link({ separator });
                } else {
                    legendData += group.link({});
                }
            });
        }

        whosOnlineData.legend = LocaleHelper.replace('whosOnlineHelper', 'groupLegend', 'legend', legendData);

        session.forEach(sess => {
            if (sess.memberId === 0 && sess.displayOnWo === 0 && sess.isBot === 0) {
                whosOnlineData.total.overall++;
                whosOnlineData.total.guests++;
            } else if (sess.memberId !== 0 && sess.displayOnWo === 0 && sess.isBot === 0) {
                whosOnlineData.total.overall++;
                whosOnlineData.total.anonymous++;
            } else if (sess.memberId === 0 && sess.displayOnWo === 0 && sess.isBot === 1) {
                whosOnlineData.total.overall++;
                whosOnlineData.total.bots++;

                if (whosOnlineData.membersList.length > 0) {
                    whosOnlineData.membersList += separator + sess.botName;
                } else {
                    whosOnlineData.membersList += sess.botName;
                }
            } else {
                whosOnlineData.total.overall++;
                whosOnlineData.total.members++;
                const member = MemberRepository.getMemberById(parseInt(sess.memberId, 10));
                const tooltip = LocaleHelper.replace('index', 'lastClick', 'time', DateTimeHelper.dateFormatter(parseInt(sess.lastClick, 10), { timeAgo: false, timeOnly: true }));

                if (whosOnlineData.membersList.length > 0) {
                    whosOnlineData.membersList += member.link({ separator, tooltip });
                } else {
                    whosOnlineData.membersList += member.link({ tooltip });
                }
            }
        });

        return whosOnlineData;
    }
}

module.exports = WhosOnlineHelper;