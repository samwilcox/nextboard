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
const LocaleHelper = require('../helpers/localeHelper');
const ForumsHelper = require('../helpers/forumsHelper');
const PermissionsService = require('../services/permissionsService');
const Features = require('../types/features');
const WhosOnlineHelper = require('../helpers/whosOnlineHelper');
const StatisticsHelper = require('../helpers/statisticsHelper');
const Settings = require('../settings');
const TagsHelper = require('../helpers/tagsHelper');

/**
 * Model for the bulletin board index.
 */
class IndexModel {
    /**
     * Returns a new instance of IndexModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Build the index of the bulletin board.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @returns {Object} The resulting vars object instance.
     */
    async buildIndex(req, res) {
        const member = req.member;
        UtilHelper.selectMenuItem('forums');
        UtilHelper.initializeBreadcrumbs();
        UtilHelper.addBreadcrumb(LocaleHelper.get('index', 'forumsBreadcrumbTitle'), UtilHelper.buildUrl());

        this.vars.categoryForums = await ForumsHelper.build();
        const toggles = member.getToggles();
        this.vars.bbic = {};

        if (toggles.bbic.enabled && PermissionsService.getFeaturePermission(Features.BBIC)) {
            this.vars.bbic.enabled = true;
            const whosOnlineEnabled = (toggles.bbic.whosOnline && PermissionsService.getFeaturePermission(Features.BBIC_WHOS_ONLINE)) ? true : false;
            const statisticsEnabled = (toggles.bbic.statistics && PermissionsService.getFeaturePermission(Features.BBIC_STATISTICS)) ? true : false;
            const tagsEnabled = (toggles.bbic.tags && PermissionsService.getFeaturePermission(Features.BBIC_TAGS)) ? true : false;
            let onlineData, currentlyOnline = null, statisticsData, tagsData;

            if (whosOnlineEnabled) {
                onlineData = WhosOnlineHelper.getWhosOnlineData();
                currentlyOnline = LocaleHelper.replaceAll('index', `currentlyOnline${onlineData.total.overall === 1 ? 'Singular' : ''}`, {
                    total: UtilHelper.formatNumber(onlineData.total.overall),
                    timeout: Settings.get('sessionDuration'),
                });
            }

            this.vars.bbic.whosOnline = {
                display: whosOnlineEnabled,
                data: whosOnlineEnabled ? onlineData : null,
                currentlyOnline,
                members: LocaleHelper.replace('index', `totalMembers${onlineData.total.members === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(onlineData.total.members)),
                anonymous: LocaleHelper.replace('index', 'totalAnonymous', 'total', UtilHelper.formatNumber(onlineData.total.anonymous)),
                guests: LocaleHelper.replace('index', `totalGuests${onlineData.total.guests === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(onlineData.total.guests)),
                bots: LocaleHelper.replace('index', `totalBots${onlineData.total.bots === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(onlineData.total.bots)),
            };

            if (statisticsEnabled) {
                statisticsData = StatisticsHelper.getBBICStatistics();
            }

            this.vars.bbic.statistics = {
                display: statisticsEnabled,
                data: statisticsEnabled ? statisticsData : null,
                newestMember: LocaleHelper.replaceAll('index', 'welcomeNewestMember', {
                    name: statisticsData.newestMember.link,
                    timestamp: statisticsData.newestMember.timestamp,
                }),
                total: {
                    members: LocaleHelper.replace('index', 'statsTotalMembers', 'total', UtilHelper.formatNumber(statisticsData.totalMembers)),
                    categories: LocaleHelper.replace('index', 'statsTotalCategories', 'total', UtilHelper.formatNumber(statisticsData.totalCategories)),
                    forums: LocaleHelper.replace('index', 'statsTotalForums', 'total', UtilHelper.formatNumber(statisticsData.totalForums)),
                    topics: LocaleHelper.replace('index', 'statsTotalTopics', 'total', UtilHelper.formatNumber(statisticsData.totalTopics)),
                    posts: LocaleHelper.replace('index', 'statsTotalPosts', 'total', UtilHelper.formatNumber(statisticsData.totalPosts)),
                },
                mostOnline: LocaleHelper.replaceAll('index', 'mostOnline', {
                    total: statisticsData.mostOnline.total,
                    timestamp: statisticsData.mostOnline.timestamp,
                }),
            };

            if (tagsEnabled) {
                tagsData = TagsHelper.getTagsBBICData();
            }
            
            this.vars.bbic.tags = {
                display: tagsEnabled,
                data: tagsData,
            };
        } else {
            this.vars.bbic.enabled = false;
        }

        this.vars.urls = {
            whosOnlineList: UtilHelper.buildUrl(['whosonline']),
            statistics: UtilHelper.buildUrl(['statistics']),
            tags: UtilHelper.buildUrl(['tags']),
        };

        return this.vars;
    }
}

module.exports = IndexModel;