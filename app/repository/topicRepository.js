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

const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * TopicRepository is responsible for handling and retrieval and construction of 'Topic' entity.
 */
class TopicRepository {
    /**
     * Fetch a topics's raw data by ID from the cache.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadTopicDataById(topicId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('topics').find(topic => topic.id === topicId);
        return data || null;
    }

    /**
     * Build a 'Topic' entity from raw data.
     * 
     * @param {Object} data - The raw topic data. 
     * @param {number} topicId - The topic identifier.
     * @returns {Topic|null} The constructed 'Topic' entity or null if data is invalid.
     */
    static buildTopicFromData(data, topicId) {
        const Topic = require('../entities/topic');
        const topic = new Topic();
        
        topic.setId(data.id ? data.id : topicId);
        topic.setCategoryId(parseInt(data.categoryId, 10));
        topic.setForumId(parseInt(data.forumId, 10));
        topic.setTitle(data.title);
        topic.setCreatedBy(parseInt(data.createdBy, 10));
        topic.setCreatedAt(DateTimeHelper.epochToDate(parseInt(data.createdAt, 10)));
        topic.setLocked(parseInt(data.locked, 10) === 1);
        topic.setTotalReplies(parseInt(data.totalReplies, 10));
        topic.setTotalViews(parseInt(data.totalViews, 10));
        topic.setLastPostId(parseInt(data.lastPostId, 10));
        topic.setTags(data.tags ? JSON.parse(data.tags) : null);
        topic.setAnswered(data.answered ? parseInt(data.answered, 10) === 1 : false);
        topic.setAnsweredData(data.answeredData ? JSON.parse(data.answeredData) : null);
        topic.setPinned(parseInt(data.pinned, 10) === 1);
        topic.setPinnedAt(data.pinnedAt ? DateTimeHelper.epochToDate(parseInt(data.pinnedAt, 10)) : null);
        topic.setPinnedBy(data.pinnedBy ? parseInt(data.pinnedBy, 10) : null);
        topic.setPoll(data.poll ? JSON.parse(data.poll) : null);

        return topic;
    }

    /**
     * Get the 'Topic' entity by ID.
     * 
     * @param {number} topicId - The topic identifier.
     * @returns {Topic|null} The 'Topic' entity or null if not found.
     */
    static getTopicById(topicId) {
        const data = this.loadTopicDataById(topicId);
        return this.buildTopicFromData(data, topicId);
    }
}

module.exports = TopicRepository;