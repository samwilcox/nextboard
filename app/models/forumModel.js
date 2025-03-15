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

const ForumsHelper = require('../helpers/forumsHelper');
const LocaleHelper = require('../helpers/localeHelper');
const ForumRepository = require('../repository/forumRepository');
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require('../types/forumPermissions');
const LoggerService = require('../services/loggerService');
const UtilHelper = require('../helpers/utilHelper');
const FollowingHelper = require('../helpers/followingHelper');
const PaginationHelper = require('../helpers/paginationHelper');
const DateTimeHelper = require('../helpers/dateTimeHelper');
const FilterHelper = require('../helpers/filterHelper');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const WhosOnlineHelper = require('../helpers/whosOnlineHelper');
const dataStoreService = require('../services/dataStoreService');

/**
 * Model for displaying a forum.
 */
class ForumModel {
    /**
     * Returns a new instance of ForumModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Display a selected forum.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @returns {Object} An object containing all the vars.
     */
    async displayForum(req, res) {
        UtilHelper.selectMenuItem('forums');
        const { forumId, slug, page } = req.params;
        const member = req.member;
        const forum = ForumRepository.getForumById(forumId);

        if (!forum) {
            await LoggerService.logAccess(
                member.getId() > 0 ? member.getId() : null,
                UtilHelper.getUrl(req),
                req.get('Referer') || 'None',
                UtilHelper.getUserIp(req),
                req.headers['user-agent'],
                'notfound'
            );

            throw new Error(LocaleHelper.get('errors', 'forumDoesNotExistOnClick'));
        }

        if (!PermissionsService.hasForumPermission(forumId, ForumPermissions.VIEW_FORUM)) {
            await LoggerService.logSecurityEvent(
                member.getId() > 0 ? member.getId() : null,
                `Attempt to view forum [ID: ${forum.getId()}, Title: ${forum.getTitle()}] without view permissions`,
                'blocked',
                UtilHelper.getUserIp(req),
                req.headers['user-agent']
            );

            throw new Error(LocaleHelper.get('errors', 'invalidViewForumPermissions'));
        }

        ForumsHelper.checkForPassword(res, forumId);
        await ForumsHelper.handleRedirectForum(req, res, forumId);

        UtilHelper.initializeBreadcrumbs();
        UtilHelper.addBreadcrumb(LocaleHelper.get('forum', 'forumsBreadcrumbTitle'), UtilHelper.buildUrl(), true);
        ForumsHelper.buildForumBreadcrumbs(forumId);

        dataStoreService.set('showBreadcrumbs', true);

        const totalTopics = UtilHelper.formatNumber(ForumsHelper.getTotalTopicsInForum(forum.getId()));
        const totalPosts = UtilHelper.formatNumber(ForumsHelper.getTotalPostsInForum(forum.getId()));
        const totalPosters = UtilHelper.formatNumber(ForumsHelper.getTotalPostersInForum(forum.getId()));
        const totalViews = UtilHelper.formatNumber(ForumsHelper.getTotalViewsInForum(forum.getId()));

        this.vars.totalTopics = LocaleHelper.replace('forum', `headerTotalTopics${parseInt(totalTopics, 10) === 1 ? 'Singular' : ''}`, 'total', totalTopics);
        this.vars.totalPosts = LocaleHelper.replace('forum', `headerTotalPosts${parseInt(totalPosts, 10) === 1 ? 'Singular' : ''}`, 'total', totalPosts);
        this.vars.totalPosters = LocaleHelper.replace('forum', `headerTotalPosters${parseInt(totalPosters, 10) === 1 ? 'Singular' : ''}`, 'total', totalPosters);
        this.vars.totalViews = LocaleHelper.replace('forum', `headerTotalViews${parseInt(totalViews, 10) === 1 ? 'Singular' : ''}`, 'total', totalViews);

        this.vars.subForums = ForumsHelper.build({ forumId: forum.getId() });
        this.vars.createTopic = PermissionsService.getFeaturePermission(ForumPermissions.CREATE_TOPIC);

        this.vars.urls = {
            createTopic: `${UtilHelper.buildUrl(['create', 'topic'])}/${UtilHelper.addIdAndNameToUrl(forum.getId(), forum.getTitle())}`,
        };

        this.vars.totalFollowing = UtilHelper.formatNumber(FollowingHelper.getTotalFollowing('forum', forum.getId()));
        this.vars.isFollowing = FollowingHelper.isFollowing('forum', forum.getId());
        this.vars.isSignedIn = member.isSignedIn();
        this.vars.paginationTop = PaginationHelper.buildPaginationComponent(
            ForumsHelper.getTotalTopicsInForum(forum.getId()),
                page ? page : 1, 
                member.getPerPage().topics, {
                    preUrl: forum.url(),
                    nameOfItem: LocaleHelper.get('forum', 'topic'),
                    nameOfItems: LocaleHelper.get('forum', 'topics'),
                });

        this.vars.paginationBottom = PaginationHelper.buildPaginationComponent(
            ForumsHelper.getTotalTopicsInForum(forum.getId()),
                page ? page : 1, 
                member.getPerPage().topics, {
                    preUrl: forum.url(),
                    nameOfItem: LocaleHelper.get('forum', 'topic'),
                    nameOfItems: LocaleHelper.get('forum', 'topics'),
                    marginTop: true,
                });

        const paginationData = PaginationHelper.paginate(ForumsHelper.getTotalTopicsInForum(forum.getId()), page ? page : 1, member.getPerPage().topics);
        const filter = FilterHelper.getForumFilterData(req, `forum-${forum.getId()}-topiclist`, forum.getId());
        const defaultTopicFilters = forum.getDefaultFilters().topic;
        this.vars.timeframes = DateTimeHelper.generateTimeFrames(defaultTopicFilters.timeframe);
        let filterItems = [];
        let sortByItems = [];
        let sortOrderItems = [];
        let timeframeItems = [];

        if (filter) {
            if (filter.filterItems && Array.isArray(filter.filterItems) && filter.filterItems.length > 0) {
                filterItems = filter.filterItems;
            }

            if (filter.sortByItems && Array.isArray(filter.sortByItems) && filter.sortByItems.length > 0) {
                sortByItems = filter.sortByItems;
            }

            if (filter.sortOrderItems && Array(filter.sortOrderItems) && filter.sortOrderItems.length > 0) {
                sortOrderItems = filter.sortOrderItems;
            }

            if (filter.timeframeItems && Array.isArray(filter.timeframeItems) && filter.timeframeItems.length > 0) {
                timeframeItems = filter.timeframeItems;
            }
        } else {
            const filterLegend = [
                { name: LocaleHelper.get('forum', 'filterAll'), value: 'all' },
                { name: LocaleHelper.get('forum', 'filterContainsReply'), value: 'contain-reply' },
                { name: LocaleHelper.get('forum', 'filterContainsNoReplies'), value: 'contains-no-replies' },
                { name: LocaleHelper.get('forum', 'filterHot'), value: 'hot' },
                { name: LocaleHelper.get('forum', 'filterNotHot'), value: 'not-hot' },
                { name: LocaleHelper.get('forum', 'filterPopular'), value: 'popular' },
                { name: LocaleHelper.get('forum', 'filterNotPopular'), value: 'not-popular' },
                { name: LocaleHelper.get('forum', 'filterRead'), value: 'read' },
                { name: LocaleHelper.get('forum', 'filterNotRead'), value: 'not-read' },
                { name: LocaleHelper.get('forum', 'filterViews'), value: 'views' },
                { name: LocaleHelper.get('forum', 'filterNoViews'), value: 'no-views' },
                { name: LocaleHelper.get('forum', 'filterLikes'), value: 'likes' },
                { name: LocaleHelper.get('forum', 'filterNoLikes'), value: 'no-likes' },
                { name: LocaleHelper.get('forum', 'filterContainsAttachment'), value: 'contains-attachment' },
                { name: LocaleHelper.get('forum', 'filterNoAttachment'), value: 'no-attachment' },
                { name: LocaleHelper.get('forum', 'filterAnswered'), value: 'answered' },
                { name: LocaleHelper.get('forum', 'filterNotAnswered'), value: 'not-answered' },
                { name: LocaleHelper.get('forum', 'filterLocked'), value: 'locked' }
            ];

            const sortByLegend = [
                { name: LocaleHelper.get('forum', 'sortByLatestPost'), value: 'post-created-at'},
                { name: LocaleHelper.get('forum', 'sortByLatestTopic'), value: 'topic-created-at'},
                { name: LocaleHelper.get('forum', 'sortByTitle'), value: 'title'},
                { name: LocaleHelper.get('forum', 'sortByTopicCreator'), value: 'creator'},
                { name: LocaleHelper.get('forum', 'sortByTotalReplies'), value: 'total-replies'},
                { name: LocaleHelper.get('forum', 'sortByTotalViews'), value: 'total-views'},
                { name: LocaleHelper.get('forum', 'sortByTotalLikes'), value: 'total-likes'},
                { name: LocaleHelper.get('forum', 'sortByAnswered'), value: 'anwered'}
            ];

            const sortOrderLegend = [
                { name: LocaleHelper.get('forum', 'sortOrderAsc'), value: 'ASC' },
                { name: LocaleHelper.get('forum', 'sortOrderDesc'), value: 'DESC' }
            ];

            filterLegend.forEach(filter => {
                filterItems.push({ name: filter.name, value: filter.value, selected: filter.value === defaultTopicFilters.filter });
            });

            sortByLegend.forEach(sortBy => {
                sortByItems.push({ name: sortBy.name, value: sortBy.value, selected: sortBy.value === defaultTopicFilters.sortBy });
            });

            sortOrderLegend.forEach(sortOrder => {
                sortOrderItems.push({ name: sortOrder.name, value: sortOrder.value, selected: sortOrder.value === defaultTopicFilters.sortOrder });
            });
        }

        this.vars.filter = {
            filter: filterItems,
            sortBy: sortByItems,
            sortOrder: sortOrderItems,
        };
        
        const cache = CacheProviderFactory.create();
        const topics = cache.get('topics').filter(topic => topic.forumId === forum.getId());
        this.vars.topicsData = await FilterHelper.filterTopics(topics, paginationData.from, defaultTopicFilters.filter, defaultTopicFilters.sortBy, defaultTopicFilters.sortOrder, defaultTopicFilters.timeframe);
        this.vars.browsing = WhosOnlineHelper.getBrowsingComponent('forum', forum.getId());

        return this.vars;
    }
}

module.exports = ForumModel;