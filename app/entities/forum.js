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

const OutputHelper = require("../helpers/outputHelper");
const UtilHelper = require("../helpers/utilHelper");
const LocaleHelper = require('../helpers/localeHelper');
const DateTimeHelper = require("../helpers/dateTimeHelper");
const MemberService = require('../services/memberService');
const ForumsHelper = require("../helpers/forumsHelper");
const PostHelper = require("../helpers/postHelper");
const TopicHelper = require("../helpers/topicHelper");
const Features = require('../types/features');
const PermissionsService = require('../services/permissionsService');

/**
 * An entity that represents a single Forum.
 */
class Forum {
    /**
     * Create a new instance of Forum.
     */
    constructor() {
        this.id = null;
        this.categoryId = null;
        this.category = null;
        this.title = null;
        this.description = null;
        this.sortOrder = null;
        this.createdAt = null;
        this.hasParent = false;
        this.parentId = null;
        this.parent = null;
        this.showSubForums = false;
        this.visible = false;
        this.archived = false;
        this.image = null;
        this.totalTopics = null;
        this.totalPosts = null;
        this.lastPostId = null;
        this.redirect = {};
        this.passwordProtected = false;
        this.password = null;
        this.forumType = null;
        this.can = {};
        this.hotThreshold = null;
        this.popularityThreshold = null;
        this.defaultFilters = null;
        this.censor = false;
        this.uniqueViewIncrementation = false;
        this.poll = {};
    }

    /**
     * Get the forum identifier.
     * 
     * @returns {number} The forum identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the forum identifier.
     * 
     * @param {number} id - The forum identifier.
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
     * Get the category entity instance.
     * 
     * @returns {Category} The category entity instance.
     */
    getCategory() {
        return this.category;
    }

    /**
     * Set the category entity instance.
     * 
     * @param {Category} category - The category entity instance.
     */
    setCategory(category) {
        this.category = category;
    }

    /**
     * Get the forum title.
     * 
     * @returns {string} The forum title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the forum title.
     * 
     * @param {string} title - The forum title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the forum description.
     * 
     * @returns {string} The forum description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Set the forum description.
     * 
     * @param {string} description - The forum description.
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Get the forum sort order.
     * 
     * @returns {number} The forum sort order.
     */
    getSortOrder() {
        return this.sortOrder;
    }

    /**
     * Set the forum sort order.
     * 
     * @param {number} sortOrder - The forum sort order.
     */
    setSortOrder(sortOrder) {
        this.sortOrder = sortOrder;
    }

    /**
     * Get the forum creation date.
     * 
     * @returns {Date} The forum creation date.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the forum creation date.
     * 
     * @param {Date} createdAt - The forum creation date.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the forum identifier.
     * 
     * @returns {number} The forum identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the forum identifier.
     * 
     * @param {number} id - The forum identifier.
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
     * Get the category entity instance.
     * 
     * @returns {Category} The category entity instance.
     */
    getCategory() {
        return this.category;
    }

    /**
     * Set the category entity instance.
     * 
     * @param {Category} category - The category entity instance.
     */
    setCategory(category) {
        this.category = category;
    }

    /**
     * Get the forum title.
     * 
     * @returns {string} The forum title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Set the forum title.
     * 
     * @param {string} title - The forum title.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Get the forum description.
     * 
     * @returns {string} The forum description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Set the forum description.
     * 
     * @param {string} description - The forum description.
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * Get the forum sort order.
     * 
     * @returns {number} The forum sort order.
     */
    getSortOrder() {
        return this.sortOrder;
    }

    /**
     * Set the forum sort order.
     * 
     * @param {number} sortOrder - The forum sort order.
     */
    setSortOrder(sortOrder) {
        this.sortOrder = sortOrder;
    }

    /**
     * Get the forum creation date.
     * 
     * @returns {Date} The forum creation date.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the forum creation date.
     * 
     * @param {Date} createdAt - The forum creation date.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the forum parent status.
     * 
     * @returns {boolean} True if the forum has a parent, false otherwise.
     */
    getHasParent() {
        return this.hasParent;
    }

    /**
     * Set the forum parent status.
     * 
     * @param {boolean} hasParent - True if the forum has a parent, false otherwise.
     */
    setHasParent(hasParent) {
        this.hasParent = hasParent;
    }

    /**
     * Get the forum parent identifier.
     * 
     * @returns {number} The parent forum identifier.
     */
    getParentId() {
        return this.parentId;
    }

    /**
     * Set the forum parent identifier.
     * 
     * @param {number} parentId - The parent forum identifier.
     */
    setParentId(parentId) {
        this.parentId = parentId;
    }

    /**
     * Get the parent forum entity.
     * 
     * @returns {Forum} The parent forum entity.
     */
    getParent() {
        return this.parent;
    }

    /**
     * Set the parent forum entity.
     * 
     * @param {Forum} parent - The parent forum entity.
     */
    setParent(parent) {
        this.parent = parent;
    }

    /**
     * Get whether to display the sub forums.
     * 
     * @returns {boolean} True to show sub forums, false not to.
     */
    getShowSubForums() {
        return this.showSubForums;
    }

    /**
     * Set whether to display the sub forums.
     * 
     * @param {boolean} showSubForums - True to show sub forums, false not to. 
     */
    setShowSubForums(showSubForums) {
        this.showSubForums = showSubForums;
    }

    /**
     * Check if the forum is visible.
     * 
     * @returns {boolean} True if the forum is visible, otherwise false.
     */
    isVisible() {
        return this.visible;
    }

    /**
     * Set the forum visibility.
     * 
     * @param {boolean} visible - True to make the forum visible, false to hide it.
     */
    setVisible(visible) {
        this.visible = visible;
    }

    /**
     * Check if the forum is archived.
     * 
     * @returns {boolean} True if the forum is archived, otherwise false.
     */
    isArchived() {
        return this.archived;
    }

    /**
     * Set the forum archived status.
     * 
     * @param {boolean} archived - True to archive the forum, false to unarchive it.
     */
    setArchived(archived) {
        this.archived = archived;
    }

    /**
     * Get the forum image URL.
     * 
     * @returns {string} The image URL.
     */
    getImage() {
        return this.image;
    }

    /**
     * Set the forum image URL.
     * 
     * @param {string} image - The image URL.
     */
    setImage(image) {
        this.image = image;
    }

    /**
     * Get the total number of topics.
     * 
     * @returns {number} The total topics count.
     */
    getTotalTopics() {
        return this.totalTopics;
    }

    /**
     * Set the total number of topics.
     * 
     * @param {number} totalTopics - The total topics count.
     */
    setTotalTopics(totalTopics) {
        this.totalTopics = totalTopics;
    }

    /**
     * Get the total number of posts.
     * 
     * @returns {number} The total posts count.
     */
    getTotalPosts() {
        return this.totalPosts;
    }

    /**
     * Set the total number of posts.
     * 
     * @param {number} totalPosts - The total posts count.
     */
    setTotalPosts(totalPosts) {
        this.totalPosts = totalPosts;
    }

    /**
     * Get the last post identifier.
     * 
     * @returns {number} The last post ID.
     */
    getLastPostId() {
        return this.lastPostId;
    }

    /**
     * Set the last post identifier.
     * 
     * @param {number} lastPostId - The last post ID.
     */
    setLastPostId(lastPostId) {
        this.lastPostId = lastPostId;
    }

    /**
     * Get the redirect settings.
     * 
     * @returns {object} The redirect settings.
     */
    getRedirect() {
        return this.redirect;
    }

    /**
     * Set the redirect settings.
     * 
     * @param {object} redirect - The redirect settings.
     */
    setRedirect(redirect) {
        this.redirect = redirect;
    }

    /**
     * Check if the forum is password protected.
     * 
     * @returns {boolean} True if protected, false otherwise.
     */
    isPasswordProtected() {
        return this.passwordProtected;
    }

    /**
     * Set the forum password protection status.
     * 
     * @param {boolean} passwordProtected - The protection status.
     */
    setPasswordProtected(passwordProtected) {
        this.passwordProtected = passwordProtected;
    }

    /**
     * Get the forum password.
     * 
     * @returns {string} The forum password.
     */
    getPassword() {
        return this.password;
    }

    /**
     * Set the forum password.
     * 
     * @param {string} password - The forum password.
     */
    setPassword(password) {
        this.password = password;
    }

    /**
     * Get the forum type.
     * 
     * @returns {string} The forum type.
     */
    getForumType() {
        return this.forumType;
    }

    /**
     * Set the forum type.
     * 
     * @param {string} forumType - The forum type.
     */
    setForumType(forumType) {
        this.forumType = forumType;
    }

    /**
     * Get whether the topic is considered 'hot'.
     * 
     * @returns {number} The total replies for a topic to be considered 'hot'.
     */
    getHotThreshold() {
        return this.hotThreshold;
    }

    /**
     * Set whether the topic is considered 'hot'.
     * 
     * @param {number} hotThreshold - The total replies for a topic to be considered 'hot'.
     */
    setHotThreshold(hotThreshold) {
        this.hotThreshold = hotThreshold;
    }

    /**
     * Get the popularity threshold value.
     * 
     * @returns {number} The popularity threshold to be considered 'popular'.
     */
    getPopularityThreshold() {
        return this.popularityThreshold;
    }

    /**
     * Set the popularity threshold value.
     * 
     * @param {number} popularityThreshold - The popularity threshold to be considered 'popular'.
     */
    setPopularityThreshold(popularityThreshold) {
        this.popularityThreshold = popularityThreshold;
    }

    /**
     * Get the default filter data for the forum.
     * 
     * @returns {Object} An object containing data for the filters within the forum.
     */
    getDefaultFilters() {
        return this.defaultFilters;
    }

    /**
     * Set the default filter data for the forum.
     * 
     * @param {Object} defaultFilters - An object containing data for the filters within the forum.
     */
    setDefaultFilters(defaultFilters) {
        this.defaultFilters = defaultFilters;
    }

    /**
     * Get the object containing the can/cant options.
     * 
     * @returns {Object} An object containing can/cant do options.
     */
    getCan() {
        return this.can;
    }

    /**
     * Set the object containing the can/cant options.
     * 
     * @param {Object} can - An object containing can/cant do options. 
     */
    setCan(can) {
        this.can = can;
    }

    /**
     * Get whether to censor the forum posts.
     * 
     * @returns {boolean} True to censor words, false not to.
     */
    getCensor() {
        return this.censor;
    }

    /**
     * Set whether to censor the forum posts.
     * 
     * @param {boolean} censor - True to censor words, false not to.
     */
    setCensor(censor) {
        this.censor = censor;
    }

    /**
     * Get whether topic views should increment uniquely.
     * 
     * @returns {boolean} True to use unique view counting, false not to.
     */
    getUniqueViewIncrementation() {
        return this.uniqueViewIncrementation;
    }

    /**
     * Set whether topic views should increment uniqely.
     * 
     * @param {boolean} uniqueViewIncrementation - True to use unique view counting, false not to.
     */
    setUniqueViewIncrementation(uniqueViewIncrementation) {
        this.uniqueViewIncrementation = uniqueViewIncrementation;
    }

    /**
     * Get the poll settings for this forum.
     * 
     * @returns {Object} An object containing the poll settings for this forum.
     */
    getPoll() {
        return this.poll;
    }

    /**
     * Set the poll settings for this forum.
     * 
     * @param {Object} poll - An object containing the poll settings for this forum. 
     */
    setPoll(poll) {
        this.poll = poll;
    }

    /**
     * Builds the URL web address to this forum.
     * 
     * @returns {string} The URL web address for this forum.
     */
    url() {
        return `${UtilHelper.buildUrl(['forum'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getTitle())}`;
    }

    /**
     * Builds the link to this topic.
     * 
     * @returns {string} The link to this topic.
     */
    link() {
        return UtilHelper.buildLink(this.getTitle(), {
            url: this.url(),
        });
    }

    /**
     * Build this entity.
     * 
     * @returns {string} The built entity source.
     */
     async build() {
        let lastClick, lastPost = {}, lastClickFull;
        const member = MemberService.getMember();

        if (this.getLastPostId()) {
            const post = PostHelper.getPost(this.getLastPostId());
            const topic = TopicHelper.getTopic(post.getTopicId());

            if (post && topic) {
                const lastPostMember = MemberService.getMemberById(post.getCreatedBy());

                if (lastPostMember) {
                    lastPost.photo = await lastPostMember.profilePhoto({ type: 'thumbnail', url: true });
                    lastPost.by = LocaleHelper.replace('forumEntity', 'by', 'author', lastPostMember.link());
                } else {
                    lastPost.photo = null;
                }

                lastPost.topicTitle = topic.getTitle();
                lastPost.topicUrl = topic.url();
                lastPost.timestamp = DateTimeHelper.dateFormatter(post.getCreatedAt(), { timeAgo: true });
                lastPost.rawTimestamp = post.getCreatedAt();
            } else {
                lastPost = null;
            }
        }
        
        if (this.getRedirect() && this.getRedirect().lastClick) {
            lastClick = LocaleHelper.replace('forumEntity', 'lastClick', 'timestamp', DateTimeHelper.dateFormatter(this.getRedirect().lastClick, { timeAgo: true }));
            lastClickFull = DateTimeHelper.dateFormatter(this.getRedirect().lastClick, { timeAgo: false });
        } else {
            lastClick = LocaleHelper.get('forumEntity', 'noClicks');
            lastClickFull = null;
        }

        const redirect = this.getRedirect();
        let browsing = null;

        if (!redirect || !redirect.enabled) {
            if (PermissionsService.getFeaturePermission(Features.FORUM_TOTAL_BROWSING_LINK) && member.getToggles().display.browsingForumLink) {
                browsing = LocaleHelper.replace('forumEntity', 'browsing', 'total', UtilHelper.formatNumber(ForumsHelper.getTotalBrowsingForum(this.getId())));
            }
        }
        
        return OutputHelper.getPartial('forumEntity', 'entity', {
            redirect: redirect,
            totalClicks: this.getRedirect() ? UtilHelper.formatNumber(this.getRedirect().totalClicks) : null,
            read: lastPost ? UtilHelper.isContentRead('forum', this.getId(), lastPost.rawTimestamp) : false,
            archived: this.isArchived(),
            url: this.url(),
            title: this.getTitle(),
            totalTopics: UtilHelper.formatNumber(this.getTotalTopics()),
            totalPosts: UtilHelper.formatNumber(this.getTotalPosts()),
            totalClicks: this.getRedirect() ? UtilHelper.formatNumber(this.getRedirect().totalClicks) : null,
            description: this.getDescription(),
            lastClick: lastClick,
            lastPost,
            imagesetUrl: member.getConfigs().imagesetUrl,
            subForums: ForumsHelper.buildSubForumsComponents(this.getId()),
            browsing,
            lastClickFull,
        });
    }
}

module.exports = Forum;