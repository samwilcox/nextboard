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

const SessionList = require("../lists/SessionList");
const ForumRepository = require("../repository/forumRepository");
const PostRepository = require("../repository/postRepository");
const TopicRepository = require("../repository/topicRepository");
const MemberService = require("../services/memberService");
const DateTimeHelper = require("./dateTimeHelper");
const OutputHelper = require("./outputHelper");
const SessionHelper = require("./sessionHelper");
const TopicHelper = require("./topicHelper");
const UtilHelper = require("./utilHelper");

/**
 * Helpers for managing various filters.
 */
class FilterHelper {
    /**
     * Filter the given topics.
     * 
     * @param {Array} topics - The topics to filter.
     * @param {number} from - The index at which to start from.
     * @param {string} filter - The filter to filter with.
     * @param {string} sortBy - The item to sort by.
     * @param {string} sortOrder - The sort order.
     * @param {string} timeFrame - The timeframe.
     * @returns {Promise<Object>} A promise that resolves to an object containing the filtered data.
     */
    static async filterTopics(topics, from, filter, sortBy, sortOrder, timeFrame) {
        let entities = await Promise.all(topics.map(topic => TopicRepository.getTopicById(topic.id)));

        // Be sure to check for pinned topics (if we are on the first page)
        if (from === 0) {
            entities.sort((a, b) => {
                if (a.isPinned() && !b.isPinned()) return -1;
                if (!a.isPinned() && b.isPinned()) return 1;

                if (a.isPinned() && b.isPinned()) {
                    return a.getPinnedAt() - b.getPinnedAt();
                }

                return 0;
            });
        }

        if (entities) {
            entities.forEach(entity => {
                entity.setLatestPostTimestamp(TopicHelper.determineLatestPostTimestamp(entity.getId()));
            });
        }

        const hasEntities = entities.length > 0;
        let status = hasEntities;
        from = parseInt(from, 10);

        const filters = {
            'all': () => entities,
            'contains-reply': () => entities.filter(entity => TopicHelper.containsReplies(entity.getId())),
            'contains-no-replies': () => entities.filter(entity => !TopicHelper.containsReplies(entity.getId())),
            'hot': () => entities.filter(entity => entity.getTotalReplies() >= ForumRepository.getForumById(entity.getForumId()).getHotTheshold()),
            'not-hot': () => entities.filter(entity => entity.getTotalReplies() < ForumRepository.getForumById(entity.getForumId()).getHotTheshold()),
            'popular': () => entities.filter(entity => (entity.getTotalViews() + TopicHelper.getTotalLikes(entity.getId(), { includePosts: true })) >= ForumRepository.getForumById(entity.getForumId()).getPopularityTheshold()),
            'not-popular': () => entities.filter(entity => (entity.getTotalViews() + TopicHelper.getTotalLikes(entity.getId(), { includePosts: true })) < ForumRepository.getForumById(entity.getForumById()).getPopularityTheshold()),
            'read': () => entities.filter(entity => UtilHelper.isContentRead('topic', entity.getId())),
            'not-read': () => entities.filter(entity => !UtilHelper.isContentRead('topic', entity.getId())),
            'views': () => entities.filter(entity => entity.getTotalViews() > 0),
            'no-views': () => entities.filter(entity => entity.getTotalViews() === 0),
            'likes': () => entities.filter(entity => TopicHelper.getTotalLikes(entity.getId(), { includePosts: true }) > 0),
            'no-likes': () => entities.filter(entity => TopicHelper.getTotalLikes(entity.getId(), { includePosts: true }) === 0),
            'contains-attachment': () => entities.filter(entity => TopicHelper.hasAttachment(entity.getId())),
            'no-attachment': () => entities.filter(entity => !TopicHelper.hasAttachment(entity.getId())),
            'answered': () => entities.filter(entity => entity.getAnswered()),
            'no-answered': () => entities.filter(entity => !entity.getAnswered()),
            'locked': () => entities.filter(entity => entity.isLocked())
        };

        entities = filters[filter.toLowerCase()] ? filters[filter.toLowerCase()]() : entities;
        if (entities.length === 0) status = hasEntities ? 'nonebyFilter' : 'none';
        
        const sortFunctions = {
            'post-created-at': (a, b) => new Date(a.getLatestPostTimestamp()) - new Date(b.getLatestPostTimestamp()),
            'topic-created-at': (a, b) => new Date(a.getCreatedAt()) - new Date(b.getCreatedAt()),
            'title': (a, b) => a.getTitle().localeCompare(b.getTitle()),
            'creator': (a, b) => a.getCreatedByName().localeCompare(b.getCreatedByName()),
            'total-replies': (a, b) => a.getTotalReplies() - b.getTotalReplies(),
            'total-views': (a, b) => a.getTotalViews() - b.getTotalViews(),
            'total-likes': (a, b) => a.getTotalLikes() - b.getTotalLikes(),
            'answered': (a, b) => a.getAnswered() - b.getAnswered()
        };

        if (sortBy && sortFunctions[sortBy.toLowerCase()]) {
            entities.sort((a, b) => {
                const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
                return order * sortFunctions[sortBy.toLowerCase()](a, b);
            });
        }

        const { start, end } = DateTimeHelper.getTimeRange(timeFrame);

        entities.forEach(entity => entity.setLatestPostTimestamp(TopicHelper.getLatestPostTimestamp(entity.getId())));
        entities = entities.filter(entity => entity.getLatestPostTimestamp() >= start && entity.getLatestPostTimestamp() < end);
        if (entities.length === 0) status = hasEntities ? 'noneByFilter' : 'none';
        
        const member = MemberService.getMember();
        const perPage = member.getPerPage().topics;
        entities = entities.slice(from, from + perPage);
        let noTopics = null;

        if (status === 'none') {
            noTopics = OutputHelper.getPartial('filterHelper', 'no-topics');
        } else if (status === 'nonByFilter') {
            noTopics = OutputHelper.getPartial('filterHelper', 'no-topics-filter');
        }

        entities.forEach(entity => {
            entity.setLastPost(PostRepository.getPostById(entity.getLastPostId()));
        });

        const builtTopics = await Promise.all(entities.map(entity => entity.build()));

        return {
            hasTopics: topics.length > 0,
            noTopics,
            topics: builtTopics,
            from: noTopics !== null ? from + perPage : 0,
        };
    }

    /**
     * Get the filter data for the given filter.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} filterName - The filter name to get.
     * @param {number} forumId - The forum identifier.
     * @returns {Object} An object containing the filter data.
     */
    static getForumFilterData(req, filterName, forumId) {
        const forum = ForumRepository.getForumById(forumId);

        if (SessionHelper.exists(req, SessionList.FILTERS)) {
            const filter = JSON.parse(SessionHelper.get(req ,SessionList.FILTERS))
                .find(filter => filter.name === filterName);
            const exists = filter ? true : false;

            if (exists) {
                return filter;
            }
        }

        return null;
    }

    /**
     * Set the given filter data to the given filter.
     * 
     * @param {Object} req - The request object from Express.
     * @param {string} filterName - The filter name to set.
     * @param {Object} data - The data to save to the filter.
     */
    static setFilterData(req, filterName, data) {
        if (SessionHelper.exists(req, SessionList.FILTERS)) {
            let filters = JSON.parse(SessionHelper.get(req, SessionList.FILTERS));
            const index = filters.findIndex(filter => filter.name === filterName);

            if (index != -1) {
                filters[index] = data;
                SessionHelper.set(req, SessionList.FILTERS, JSON.stringify(filters));
            }
        } else {
            SessionHelper.set(req, SessionList.FILTERS, [data]);
        }
    }
}

module.exports = FilterHelper;