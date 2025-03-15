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

const DateTimeHelper = require("../helpers/dateTimeHelper");
const LikeHelper = require("../helpers/likeHelper");
const LocaleHelper = require("../helpers/localeHelper");
const OutputHelper = require("../helpers/outputHelper");
const TopicHelper = require("../helpers/topicHelper");
const UtilHelper = require("../helpers/utilHelper");
const MemberRepository = require("../repository/memberRepository");

/**
 * An entity that represents a single topic.
 */
class Topic {
    /**
     * Creates a new instance of Topic.
     */
    constructor() {
        this.id = null;
        this.categoryId = null;
        this.category = null;
        this.forumId = null;
        this.forum = null;
        this.title = null;
        this.createdBy = null;
        this.createdAt = null;
        this.creator = null;
        this.locked = false;
        this.totalReplies = null;
        this.totalViews = null;
        this.lastPostId = null;
        this.lastPost = null;
        this.tags = null;
        this.tagEntities = null;
        this.popularity = null;
        this.answered = false;
        this.answeredData = {};
        this.totalLikes = null;
        this.createdByName = null;
        this.latestPostTimestamp = null;
        this.pinned = false;
        this.pinnedAt = null;
        this.pinnedBy = null;
        this.poll = {};
    }

    /**
     * Get the topic identifier.
     * 
     * @returns {number} The topic identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the topic identifier.
     * 
     * @param {number} id - The topic identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the category identifier.
     * 
     * @returns {number} The category identifier.
     */
    getCategoryId() {
        return this.categoryId;
    }

    /**
     * Set the category identifier.
     * 
     * @param {number} categoryId - The category identifier.
     */
    setCategoryId(categoryId) {
        this.categoryId = categoryId;
    }

    /**
     * Get the category entity.
     * 
     * @returns {object} The category entity object.
     */
    getCategory() {
        return this.category;
    }

    /**
     * Set the category entity.
     * 
     * @param {object} category - The category entity object.
     */
    setCategory(category) {
        this.category = category;
    }

    /**
     * Get the forum identifier.
     * 
     * @returns {number} The forum identifier.
     */
    getForumId() {
        return this.forumId;
    }

    /**
     * Set the forum identifier.
     * 
     * @param {number} forumId - The forum identifier.
     */
    setForumId(forumId) {
        this.forumId = forumId;
    }

    /**
     * Get the forum entity.
     * 
     * @returns {object} The forum entity object.
     */
    getForum() {
        return this.forum;
    }

    /**
     * Set the forum entity.
     * 
     * @param {object} forum - The forum entity object.
     */
    setForum(forum) {
        this.forum = forum;
    }

    /**
     * Get the topic title.
     * 
     * @returns {string} The topic title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the topic title.
     * 
     * @param {string} title - The topic title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the creator of the topic.
     * 
     * @returns {number} The identifier of the creator.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * Set the creator of the topic.
     * 
     * @param {number} createdBy - The identifier of the creator.
     */
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get the creation timestamp of the topic.
     * 
     * @returns {Date} The creation timestamp.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the creation timestamp of the topic.
     * 
     * @param {Date} createdAt - The creation timestamp.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the member entity of the creator.
     * 
     * @returns {Member} The member entity of the creator.
     */
    getCreator() {
        return this.creator;
    }

    /**
     * Set the member entity of the creator.
     * 
     * @param {Member} creator - The member entity of the creator.
     */
    setCreator(creator) {
        this.creator = creator;
    }

    /**
     * Check if the topic is locked.
     * 
     * @returns {boolean} True if the topic is locked, false otherwise.
     */
    isLocked() {
        return this.locked;
    }

    /**
     * Set the lock status of the topic.
     * 
     * @param {boolean} locked - True to lock, false to unlock.
     */
    setLocked(locked) {
        this.locked = locked;
    }

    /**
     * Get the total number of replies.
     * 
     * @returns {number} The total replies count.
     */
    getTotalReplies() {
        return this.totalReplies;
    }

    /**
     * Set the total number of replies.
     * 
     * @param {number} totalReplies - The total replies count.
     */
    setTotalReplies(totalReplies) {
        this.totalReplies = totalReplies;
    }

    /**
     * Get the total number of views.
     * 
     * @returns {number} The total views count.
     */
    getTotalViews() {
        return this.totalViews;
    }

    /**
     * Set the total number of views.
     * 
     * @param {number} totalViews - The total views count.
     */
    setTotalViews(totalViews) {
        this.totalViews = totalViews;
    }

    /**
     * Get the last post identifier.
     * 
     * @returns {number} The last post identifier.
     */
    getLastPostId() {
        return this.lastPostId;
    }

    /**
     * Set the last post identifier.
     * 
     * @param {number} lastPostId - The last post identifier.
     */
    setLastPostId(lastPostId) {
        this.lastPostId = lastPostId;
    }

    /**
     * Get the last post entity.
     * 
     * @returns {object} The last post entity object.
     */
    getLastPost() {
        return this.lastPost;
    }

    /**
     * Set the last post entity.
     * 
     * @param {object} lastPost - The last post entity object.
     */
    setLastPost(lastPost) {
        this.lastPost = lastPost;
    }

    /**
     * Get the topic tags array of identifiers.
     * 
     * @returns {number[]} An array of tag identifiers.
     */
    getTags() {
        return this.tags;
    }

    /**
     * Set the topic tags array of identifiers.
     * 
     * @param {number[]} tags An array of tag identifiers. 
     */
    setTags(tags) {
        this.tags = tags;
    }

    /**
     * Get the array of tag entities for this topic.
     * 
     * @returns {Tag[]} An array of tag entities.
     */
    getTagEntities() {
        return this.tagEntities;
    }

    /**
     * Set the array of tag entities for this topic.
     * 
     * @param {Tag[]} tagEntities - An array of tag entities. 
     */
    setTagEntities(tagEntities) {
        this.tagEntities = tagEntities;
    } 

    /**
     * Get the popularity value for this topic.
     * 
     * @returns {number} The calcuated popularity value (views + likes).
     */
    getPopularity() {
        return this.popularity;
    }

    /**
     * Set the popularity value for this topic.
     * 
     * @param {number} popularity - The calculated popularity value (views + likes). 
     */
    setPopularity(popularity) {
        this.popularity;
    }

    /**
     * Get whether the topic has been answered.
     * 
     * @returns {boolean} True if has been answered, false if not.
     */
    getAnswered() {
        return this.answered;
    }

    /**
     * Set whether the topic has been answered.,
     * 
     * @param {boolean} answered True if has been answered, false if not. 
     */
    setAnswered(answered) {
        this.answered = answered;
    }

    /**
     * Get the answered data for the topic.
     * 
     * @returns {Object} An object containing all the answered data.
     */
    getAnsweredData() {
        return this.answeredData;
    }

    /**
     * Set the answered data for the topic.
     * 
     * @param {Object} answeredData - An object containing the answered data.
     */
    setAnsweredData(answeredData) {
        this.answeredData = answeredData;
    }

    /**
     * Get the total likes for this topic (including its posts).
     * 
     * @returns {number} The total likes for this topic (including its posts).
     */
    getTotalLikes() {
        return this.totalLikes;
    }

    /**
     * Set the total likes for this topic (including its posts).
     * 
     * @param {number} totalLikes - The total likes for this topic (includes its post). 
     */
    setTotalLikes(totalLikes) {
        this.totalLikes = totalLikes;
    }

    /**
     * Get the name of the topic creator.
     * 
     * @returns {string} The name of the topic creator.
     */
    getCreatedByName() {
        return this.createdByName;
    }

    /**
     * Set the name of the topic creator.
     * 
     * @param {string} createdByName - The name of the topic creator.
     */
    setCreatedByName(createdByName) {
        this.createdByName = createdByName;
    }

    /**
     * Get the latest post in the topic timestamp value.
     * 
     * @returns {number} The timestamp value of the latest post.
     */
    getLatestPostTimestamp() {
        return this.latestPostTimestamp;
    }

    /**
     * Set the latest post in the topic timestamp value.
     * 
     * @param {number} latestPostTimestamp - The timestamp value of the latest post.
     */
    setLatestPostTimestamp(latestPostTimestamp) {
        this.latestPostTimestamp = latestPostTimestamp;
    }

    /**
     * Get whether the topic is pinned.
     * 
     * @returns {boolean} True if the topic is pinned, false if not.
     */
    isPinned() {
        return this.pinned;
    }

    /**
     * Set whether the topic is pinned.
     * 
     * @param {boolean} pinned - True if the topic is pinned, false if not.
     */
    setPinned(pinned) {
        this.pinned = pinned;
    }

    /**
     * Get the date of when this topic was pinned.
     * 
     * @returns {Date} The date when the topic was pinned.
     */
    getPinnedAt() {
        return this.pinnedAt;
    }

    /**
     * Set the date of when this topic was pinned.
     * 
     * @param {Date} pinnedAt - The date when the topic was pinned.
     */
    setPinnedAt(pinnedAt) {
        this.pinnedAt = pinnedAt;
    }

    /**
     * Get the identifier of the member that pinned the topic.
     * 
     * @returns {number} The identifier of the member that pinned the topic.
     */
    getPinnedBy() {
        return this.pinnedBy;
    }

    /**
     * Set the identifier of the member that pinned the topic.
     * 
     * @param {number} pinnedBy - The identifier of the member that pinned the topic.
     */
    setPinnedBy(pinnedBy) {
        this.pinnedBy = pinnedBy;
    }

    /**
     * Get the poll data object for this topic.
     * 
     * @returns {Object} Poll data object.
     */
    getPoll() {
        return this.poll;
    }

    /**
     * Set the poll data object for this topic.
     * 
     * @param {Object} poll - Poll data object.
     */
    setPoll(poll) {
        this.poll = poll;
    }

    /**
     * Builds the URL web address to this topic.
     * 
     * @returns {string} The URL web address to this topic.
     */
    url() {
        return `${UtilHelper.buildUrl(['topic'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getTitle())}`;
    }

    /**
     * Build this entity.
     * 
     * @returns {string} The built entity source.
     */
    async build() {
        const creator = MemberRepository.getMemberById(this.getCreatedBy());
        const lastPost = this.getLastPost();
        const lastPoster = MemberRepository.getMemberById(lastPost.getCreatedBy());
        const hot = TopicHelper.isHot(this.getId());

        return OutputHelper.getPartial('topicEntity', 'topic', {
            creatorPhoto: await creator.profilePhoto({ type: 'thumbnail', url: true }),
            title: this.getTitle(),
            url: this.url(),
            isRead: UtilHelper.isContentRead('topic', this.getId()),
            creatorLink: creator.link(),
            createdTimestamp: DateTimeHelper.dateFormatter(this.getCreatedAt(), { timeAgo: true }),
            totalLikes: UtilHelper.formatNumber(LikeHelper.getTotalLikes('topic', this.getId())),
            totalReplies: UtilHelper.formatNumber(this.getTotalReplies()),
            totalViews: UtilHelper.formatNumber(this.getTotalViews()),
            lastPosterPhoto: await lastPoster.profilePhoto({ type: 'thumbnail', url: true }),
            lastPosterLink: lastPoster.link(),
            lastPostTimestamp: DateTimeHelper.dateFormatter(lastPost.getCreatedAt(), { timeAgo: true }),
            pinned: this.isPinned(),
            hot: hot.hot,
            attachment: TopicHelper.containsAttachments(this.getId()),
            answered: this.getAnswered(),
            locked: this.isLocked(),
            hotTooltip: LocaleHelper.replace('topicEntity', 'hotTooltip', 'total', UtilHelper.formatNumber(hot.threshold)),
        });
    }
}

module.exports = Topic;