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
const DateTimeHelper = require("../helpers/dateTimeHelper");
const LikeHelper = require("../helpers/likeHelper");
const LocaleHelper = require("../helpers/localeHelper");
const OutputHelper = require("../helpers/outputHelper");
const PostsHelper = require("../helpers/postsHelper");
const StringHelper = require("../helpers/stringHelper");
const TagsHelper = require("../helpers/tagsHelper");
const UtilHelper = require("../helpers/utilHelper");
const ForumRepository = require("../repository/forumRepository");
const MemberRepository = require("../repository/memberRepository");
const memberService = require("../services/memberService");
const Settings = require('../settings');
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require('../types/forumPermissions');

/**
 * An entity that represents a single Post.
 */
class Post {
    /**
     * Creates a new instance of Post.
     */
    constructor() {
        this.id = null;
        this.categoryId = null;
        this.category = null;
        this.forumId = null;
        this.forum = null;
        this.topicId = null;
        this.topic = null;
        this.createdBy = null;
        this.createdAt = null;
        this.creator = null;
        this.content = null;
        this.tags = null;
        this.tagEntities = null;
        this.attachments = null;
        this.isFirstPost = false;
        this.ipAddress = null;
        this.hostname = null;
        this.userAgent = null;
        this.postNumber = null;
        this.includeSignature = null;
    }

    /**
     * Set the post identifier.
     * 
     * @returns {number} The post identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the post identifier.
     * 
     * @param {number} id - The post identifier.
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
     * Get the topic identifier.
     * 
     * @returns {number} The topic identifier.
     */
    getTopicId() {
        return this.topicId;
    }

    /**
     * Set the topic identifier.
     * 
     * @param {number} topicId - The topic identifier.
     */
    setTopicId(topicId) {
        this.topicId = topicId;
    }

    /**
     * Get the topic entity.
     * 
     * @returns {object} The topic entity object.
     */
    getTopic() {
        return this.topic;
    }

    /**
     * Set the topic entity.
     * 
     * @param {object} topic - The topic entity object.
     */
    setTopic(topic) {
        this.topic = topic;
    }

    /**
     * Get the creator identifier.
     * 
     * @returns {number} The creator identifier.
     */
    getCreatedBy() {
        return this.createdBy;
    }

    /**
     * Set the creator identifier.
     * 
     * @param {number} createdBy - The creator identifier.
     */
    setCreatedBy(createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get the creation timestamp.
     * 
     * @returns {Date} The creation timestamp.
     */
    getCreatedAt() {
        return this.createdAt;
    }

    /**
     * Set the creation timestamp.
     * 
     * @param {Date} createdAt - The creation timestamp.
     */
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Get the creator entity.
     * 
     * @returns {object} The creator member entity object.
     */
    getCreator() {
        return this.creator;
    }

    /**
     * Set the creator entity.
     * 
     * @param {object} creator - The creator member entity object.
     */
    setCreator(creator) {
        this.creator = creator;
    }

    /**
     * Get the content of the post.
     * 
     * @returns {string} The post content.
     */
    getContent() {
        return this.content;
    }

    /**
     * Set the content of the post.
     * 
     * @param {string} content - The post content.
     */
    setContent(content) {
        this.content = content;
    }

    /**
     * Get the tags associated with the post.
     * 
     * @returns {string[]} The tags associated with the post.
     */
    getTags() {
        return this.tags;
    }

    /**
     * Set the tags associated with the post.
     * 
     * @param {string[]} tags - The tags associated with the post.
     */
    setTags(tags) {
        this.tags = tags;
    }

    /**
     * Get the tag entities associated with the post.
     * 
     * @returns {object[]} The tag entity objects associated with the post.
     */
    getTagEntities() {
        return this.tagEntities;
    }

    /**
     * Set the tag entities associated with the post.
     * 
     * @param {object[]} tagEntities - The tag entity objects associated with the post.
     */
    setTagEntities(tagEntities) {
        this.tagEntities = tagEntities;
    }

    /**
     * Get the attachments for this post.
     * 
     * @returns {number[]} An array containing the attachment identifiers (if any).
     */
    getAttachments() {
        return this.attachments;
    }

    /**
     * Set the attachments for this post.
     * 
     * @param {number[]} attachments - An array containing the attachment identifier (if any). 
     */
    setAttachments(attachments) {
        this.attachments = attachments;
    }

    /**
     * Get whether this post is the first post in the topic.
     * 
     * @returns {boolean} True if this post is the first post in the topic, false if not.
     */
    getIsFirstPost() {
        return this.isFirstPost;
    }

    /**
     * Set whether this post is the first post in the topic.
     * 
     * @param {boolean} isFirstPost - True if this post is the first post in the topic, false if not.
     */
    setIsFirstPost(isFirstPost) {
        this.isFirstPost = isFirstPost;
    }

    /**
     * Get the IP address of the post creator.
     * 
     * @returns {string} The IP address of the post creator.
     */
    getIpAddress() {
        return this.ipAddress;
    }

    /**
     * Set the IP address of the post creator.
     * 
     * @param {string} ipAddress - The IP address of the post creator.
     */
    setIpAddress(ipAddress) {
        this.ipAddress = ipAddress;
    }

    /**
     * Get the hostname of the post creator.
     * 
     * @returns {string} The hostname of the post creator.
     */
    getHostname() {
        return this.hostname;
    }

    /**
     * Set the hostname of the post creator.
     * 
     * @param {string} hostname - The hostname of the post creator.
     */
    setHostname(hostname) {
        this.hostname = hostname;
    }

    /**
     * Get the user agent of the post creator.
     * 
     * @returns {string} The user agent of the post creator.
     */
    getUserAgent() {
        return this.userAgent;
    }

    /**
     * Set the user agent of the post creator.
     * 
     * @param {string} userAgent - The user agent of the post creator.
     */
    setUserAgent(userAgent) {
        this.userAgent = userAgent;
    }

    /**
     * Get the post number for this post in regards to the topic it belongs to.
     * 
     * @returns {number} The post number.
     */
    getPostNumber() {
        return this.postNumber;
    }

    /**
     * Set the post number for this post in regards to the topic it belongs to.
     * 
     * @param {number} postNumber - The post number. 
     */
    setPostNumber(postNumber) {
        this.postNumber = postNumber;
    }

    /**
     * Get whether to include the user's signature in the post.
     * 
     * @returns {boolean} True to include the user's signature, false not to.
     */
    getIncludeSignature() {
        return this.includeSignature;
    }

    /**
     * Set whether to include the user's signature in the post.
     * 
     * @param {boolean} includeSignature - True to include the user's signature, false not to.
     */
    setIncludeSignature(includeSignature) {
        this.includeSignature = includeSignature;
    }

    /**
     * Build the URL web address for this post.
     * 
     * @returns {string} The URL web address for this post.
     */
    url() {
        return UtilHelper.buildUrl(['post', 'view', this.getId()]);
    }

    /**
     * Returns whether this post if the first post in the topic.
     * 
     * @returns {boolean} True if the first post in the topic, false if not.
     */
    isFirst() {
        const cache = CacheProviderFactory.create();
        const posts = cache.get('posts')
            .filter(post => post.topicId === this.getTopicId())
            .sort((a, b) => a.createdAt - b.createdAt);

        const firstPost = posts[0];
        return firstPost.id === this.getId();
    }

    /**
     * Determines the post number for this post in regards to the topic in which it belongs.
     */
    determinePostNumber() {
        const cache = CacheProviderFactory.create();
        const posts = cache.get('posts')
            .filter(post => post.topicId === this.getTopicId())
            .sort((a, b) => a.createdAt - b.createdAt);

        const index = posts.findIndex(post => post.id === this.getId());
        this.setPostNumber(index !== -1 ? index + 1 : null);
    }

    /**
     * Build the entity component.
     * 
     * @returns {string} The entity component source.
     */
    async build() {
        const member = memberService.getMember();
        const creator = MemberRepository.getMemberById(this.getCreatedBy());
        const forum = ForumRepository.getForumById(this.getForumId());
        let censor = member.getCensor(), canViewIpHostname = member.isModerator() || member.isAdmin();

        if (Settings.get('overrideMemberCensorSettings')) {
            if (forum.getCensor()) {
                censor = Settings.get('defaultCensor');
            }
        }

        let content = this.getContent(), tags = null;

        if (censor) {
            content = StringHelper.censorText(content, { replacementChar: member.getCensorChar()});
        }

        if (this.getTags()) {
            tags = TagsHelper.tagIdentifiersToEntities(this.getTags());
        }

        return OutputHelper.getPartial('postEntity', 'entity', {
            post: this,
            creator,
            group: creator.getPrimaryGroup(),
            creatorPhoto: await creator.profilePhoto({ type: 'post', url: true }),
            postedAt: LocaleHelper.replace('postEntity', 'postedAt', 'timestamp', DateTimeHelper.dateFormatter(this.getCreatedAt(), { timeAgo: true })),
            info: {
                totalPosts: LocaleHelper.replace('postEntity', 'posts', 'total', UtilHelper.formatNumber(creator.getTotalPosts())),
                reputation: LocaleHelper.replace('postEntity', 'reputation', 'total', UtilHelper.formatNumber(creator.getReputation())),
                gender: LocaleHelper.replace('postEntity', 'gender', 'gender', creator.getParsedGender()),
                location: LocaleHelper.replace('postEntity', 'location', 'location', UtilHelper.buildLink(creator.getLocation(), { target: '_blank', url: `https://www.google.com/maps?q=${encodeURIComponent(creator.getLocation())}` })),
                pronouns: LocaleHelper.replace('postEntity', 'pronouns', 'pronouns', creator.getParsedPronouns()),
            },
            content,
            ipAddress: LocaleHelper.replace('postEntity', 'ipAddress', 'ip', this.getIpAddress()),
            hostname: LocaleHelper.replace('postEntity', 'hostname', 'hostname', this.getHostname()),
            canViewIpHostname,
            postNumber: this.getPostNumber(),
            postUrl: this.url(),
            forum,
            showOptions: forum.getCan().report || forum.getCan().share,
            likeButton: await LikeHelper.getLikeButtonForContent('post', this.getId()),
            tags,
            attachments: PostsHelper.attachmentsToEntities(this.getAttachments(), forum.getId()),
            canDownload: PermissionsService.hasForumPermission(forum.getId(), ForumPermissions.DOWNLOAD_FILES),
            includeSignature: this.getIncludeSignature(),
            signature: creator.getSignature(),
            showSignature: member.getToggles().display.showSignatures,
        });
    }
}

module.exports = Post;