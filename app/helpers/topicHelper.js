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
const CookieList = require("../lists/CookieList");
const ForumRepository = require("../repository/forumRepository");
const PostRepository = require("../repository/postRepository");
const TopicRepository = require("../repository/topicRepository");
const DataStoreService = require("../services/dataStoreService");
const MemberService = require("../services/memberService");
const CookieHelper = require("./cookieHelper");
const DateTimeHelper = require("./dateTimeHelper");
const LikeHelper = require("./likeHelper");
const LocaleHelper = require("./localeHelper");
const OutputHelper = require("./outputHelper");
const UtilHelper = require("./utilHelper");
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require("../types/forumPermissions");
const MathHelper = require("./mathHelper");

/**
 * Helpers for topic-related tasks.
 */
class TopicHelper {
    /**
     * Get the topic entity by the given identifier.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Topic|null} The Topic entity or null if not found. 
     */
    static getTopic(topicId) {
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return null;
        return topic;
    }

    /**
     * Check whether a given topic contains replies.
     * This will return true if there is at least 1 reply.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {boolean} True if the topic contains replies, false if it does not.
     */
    static containsReplies(topicId) {
        const cache = CacheProviderFactory.create();
        return cache.get('posts').find(post => post.isFirstPost === 0 && post.topicId === topicId) ? true : false;
    }

    /**
     * Get the total likes for a given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @param {Object} [options={}] - Options for getting total likes.
     * @param {boolean} [options.includePosts=false] - True to include likes on posts, false to not include likes on posts.
     * @returns {number} The total likes. 
     */
    static getTotalLikes(topicId, options = {}) {
        const { includePosts = false } = options;
        let total = LikeHelper.getTotalLikes('topic', topicId);

        if (includePosts) {
            const cache = CacheProviderFactory.create();
            const posts = cache.get('posts').filter(post => post.topicId === topicId);

            if (posts && Array.isArray(posts) && posts.length > 0) {
                posts.forEach(post => {
                    total += LikeHelper.getTotalLikes('post', post.id);
                });
            }
        }

        return total;
    }

    /**
     * Check whether the given topic contains attachments.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {boolean} True if the topic contains attachments, false if not.
     */
    static containsAttachments(topicId) {
        const cache = CacheProviderFactory.create();
        return cache.get('posts').find(post => post.topicId === parseInt(topicId, 10) && post.attachments !== null) ? true : false;
    }

    /**
     * Get the latest post timestamp for the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {number} The latest post timestamp value.
     */
    static getLatestPostTimestamp(topicId) {
        const cache = CacheProviderFactory.create();
        const posts = cache.get('posts').filter(post => post.topicId === topicId);
        const timestamps = [];

        posts.forEach(post => {
            timestamps.push(post.createdAt);
        });

        return Math.max(...timestamps);
    }

    /**
     * Check whether the given topic is hot.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Object} An object containing whether the topic is hot and the threshold value.
     */
    static isHot(topicId) {
        const topic = TopicRepository.getTopicById(topicId);
        const forum = ForumRepository.getForumById(topic.getForumId());
        const threshold = forum.getHotThreshold();

        return {
            hot: topic.getTotalReplies() >= threshold,
            threshold,
        };
    }

    /**
     * Get the total number of unique posters in the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {number} The total number of unique posters in the given topic.
     */
    static getTotalUniquePostersInTopic(topicId) {
        const cache = CacheProviderFactory.create();
        const currentPosters = [];
        const posts = cache.get('posts').filter(post => post.topicId === parseInt(topicId, 10));

        posts.forEach(post => {
            if (!currentPosters.includes(post.createdBy)) {
                currentPosters.push(post.createdBy);
            }
        });

        return currentPosters.length;
    }

    /**
     * Get the total number of posts in the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {number} The total number of posts in the topic.
     */
    static getTotalPostsInTopic(topicId) {
        const cache = CacheProviderFactory.create();
        return cache.get('posts').filter(post => post.topicId === parseInt(topicId, 10)).length;
    }

    /**
     * Get the total number of attachments in the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {number} The total number of attachments in the given topic.
     */
    static getTotalAttachmentsInTopic(topicId) {
        const cache = CacheProviderFactory.create();
        const posts = cache.get('posts').filter(post => post.topicId === parseInt(topicId, 10));
        let total = 0;

        posts.forEach(post => {
            if (post.attachments) {
                const attachments = JSON.parse(post.attachments);
                total += attachments.length;
            }
        });

        return total;
    }

    /**
     * Get the previous and next topic links for the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Object} An object containing the previous and next topic links.
     */
    static getPreviousAndNextTopics(topicId) {
        const topic = TopicRepository.getTopicById(topicId);

        if (!topic) {
            return null;
        }

        const cache = CacheProviderFactory.create();
        let topics = cache.get('topics')
            .map(t => TopicRepository.getTopicById(t.id))
            .filter(t => t.getForumId() === topic.getForumId())
            .sort((a, b) => a.getCreatedAt() - b.getCreatedAt());

        let previous = null, next = null;

        for (let i = 0; i < topics.length; i++) {
            if (topics[i].id === topicId) {
                previous = i > 0 ? topics[i - 1] : null;
                next = i < topics.length - 1 ? topics[i + 1] : null;
                break;
            }
        }

        return { previous, next };
    }

    /**
     * Increments the view for the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     */
    static async incrementViews(topicId) {
        const topic = TopicRepository.getTopicById(topicId);
        let increment = false;
        if (!topic) return;

        const forum = ForumRepository.getForumById(topic.getForumId());
        let hasViewedTopic;

        if (forum.getUniqueViewIncrementation()) {
            hasViewedTopic = UtilHelper.hasViewedContent('topic', topic.getId());
            if (!hasViewedTopic) increment = true;
        } else {
            increment = true;
        }

        if (increment) {
            const cache = CacheProviderFactory.create();
            const db = DatabaseProviderFactory.create();
            const builder = new QueryBuilder();

            let totalViews = topic.getTotalViews();
            totalViews++;
            topic.setTotalViews(totalViews);

            await db.query(builder
                .clear()
                .update('topics')
                .set(['totalViews'], [totalViews])
                .where('id = ?', [topic.getId()])
                .build()
            );

            const member = MemberService.getMember();
            const req = DataStoreService.get('request');
            const res = DataStoreService.get('response');

            if (member.isSignedIn()) {
                if (forum.getUniqueViewIncrementation() && !hasViewedTopic) {
                    await db.query(builder
                        .clear()
                        .insertInto('content_views_tracker', [
                            'contentType', 'contentId', 'memberId', 'addedAt'
                        ], [
                            'topic', topic.getId(), member.getId(), DateTimeHelper.dateToEpoch(new Date())
                        ])
                        .build()
                    );

                    await cache.update('content_views_tracker');
                }
            } else {
                if (forum.getUniqueViewIncrementation()) {
                    if (CookieHelper.exists(req, CookieList.CONTENT_VIEWS_TRACKER)) {
                        const viewsData = JSON.parse(CookieHelper.get(req, CookieList.CONTENT_VIEWS_TRACKER));
                        const hasViewed = viewsData.find(c => c.contentType === 'topic' && c.contentId === topic.getId()) ? true : false;

                        if (!hasViewed) {
                            viewsData.push({ contentType: 'topic', contentId: topic.getId() });
                            CookieHelper.set(res, CookieList.CONTENT_VIEWS_TRACKER, JSON.stringify(viewsData));
                        }
                    } else {
                        const viewsData = [{ contentType: 'topic', contentId: topic.getId() }];
                        CookieHelper.set(res, CookieList.CONTENT_VIEWS_TRACKER, JSON.stringify(viewsData));
                    }
                }
            }

            await cache.update('topics');
        }
    }

    /**
     * Determines the latest post for the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Date|number} The resulting Date object or 0 if not found.
     */
    static determineLatestPostTimestamp(topicId) {
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return 0;
        const post = PostRepository.getPostById(topic.getLastPostId());
        return post.getCreatedAt();
    }

    /**
     * Check whether the current user has voted in the poll.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {boolean} True if voted in poll, false if not.
     */
    static hasVotedInPoll(topicId) {
        const member = MemberService.getMember();
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return true;
        const poll = topic.getPoll();

        for (const questionKey in poll.questions) {
            const voters = poll.questions[questionKey].voters;

            for (const voterKey in voters) {
                if (voters[voterKey] && Array.isArray(voters[voterKey])) {
                    const exist = voters[voterKey].find(voter => voter === member.getId()) ? true : false;

                    if (exist) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Get the total participants in the poll for the given topic.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {number} The total participants in the poll.
     */
    static getTotalPollParticipants(topicId) {
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return true;
        const poll = topic.getPoll();
        const currentVoters = [];

        for (const questionKey in poll.questions) {
            const voters = poll.questions[questionKey].voters;

            for (const voterKey in voters) {
                if (voters[voterKey] && Array.isArray(voters[voterKey])) {
                    voters[voterKey].forEach(voter => {
                        if (!currentVoters.includes(voter)) {
                            currentVoters.push(voter);
                        }
                    });
                }
            }
        }

        return currentVoters.length;
    }

    /**
     * Get the total votes for the given poll question.
     * 
     * @param {number} topicId - The topic identifier.
     * @param {number} questionNumber - The question number.
     * @returns {number} The total number for votes for this given poll question.
     */
    static getTotalVotesForQuestion(topicId, questionNumber) {
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return 0;
        const poll = topic.getPoll();
        let totalVotes = 0;

        for (const optionKey in poll.questions[questionNumber].votes) {
            totalVotes = totalVotes + poll.questions[questionNumber].votes[optionKey];
        }

        return totalVotes;
    }
 
    /**
     * Builds the poll component if the topic has a poll.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {string|null} The poll source HTML, null if topic does not have a poll or topic is not found.
     */
    static buildPoll(topicId) {
        const member = MemberService.getMember();
        const topic = TopicRepository.getTopicById(topicId);
        if (!topic) return null;
        if (!topic.getPoll()) return null;

        const poll = topic.getPoll();
        const hasVoted = this.hasVotedInPoll(topic.getId());
        let footer = false;

        if (poll.expire.enabled && poll.expire.expireDateTime) footer = true;
        if (poll.closed) footer = true;
        if (member.isSignedIn() && !hasVoted) footer = true;

        for (const questionKey in poll.questions) {
            const totalVotes = this.getTotalVotesForQuestion(topic.getId(), questionKey);

            if (!poll.questions[questionKey].hasOwnProperty('percentages')) {
                poll.questions[questionKey].percentages = {};
            }

            for (const optionKey in poll.questions[questionKey].options) {
                poll.questions[questionKey].percentages[optionKey] = MathHelper.calculatePollOptionPercentage(totalVotes, poll.questions[questionKey].votes[optionKey]);
            }
        }

        return OutputHelper.getPartial('topicHelper', 'poll', {
            hasVoted,
            totalParticipants: LocaleHelper.replace('topicHelper', 'totalParticipants', 'total', UtilHelper.formatNumber(this.getTotalPollParticipants(topic.getId()))),
            member,
            poll,
            utilHelper: UtilHelper,
            localeHelper: LocaleHelper,
            dateTimeHelper: DateTimeHelper,
            footer,
            permissions: PermissionsService.hasForumPermissions(topic.getForumId(), [
                ForumPermissions.CLOSE_POLLS,
                ForumPermissions.CLOSE_OWN_POLLS,
                ForumPermissions.OPEN_CLOSED_POLLS,
                ForumPermissions.OPEN_OWN_CLOSED_POLLS
            ]),
            isOwnPoll: topic.getCreatedBy() === member.getId(),
            pollStringified: JSON.stringify(poll),
            topicId: topic.getId(),
        });
    }
}

module.exports = TopicHelper;