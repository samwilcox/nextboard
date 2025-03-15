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

const ForumsHelper = require("../helpers/forumsHelper");
const LocaleHelper = require("../helpers/localeHelper");
const ForumRepository = require("../repository/forumRepository");
const TopicRepository = require("../repository/topicRepository");
const ForumPermissions = require('../types/forumPermissions');
const UtilHelper = require('../helpers/utilHelper');
const PermissionsService = require('../services/permissionsService');
const TopicHelper = require("../helpers/topicHelper");
const MemberRepository = require("../repository/memberRepository");
const DateTimeHelper = require("../helpers/dateTimeHelper");
const PaginationHelper = require("../helpers/paginationHelper");
const FollowingHelper = require('../helpers/followingHelper');
const CacheProviderFactory = require("../data/cache/cacheProviderFactory");
const PostRepository = require("../repository/postRepository");
const EditorHelper = require('../helpers/editorHelper');
const WhosOnlineHelper = require('../helpers/whosOnlineHelper');
const DataStoreService = require('../services/dataStoreService');
const Settings = require("../settings");

/**
 * Model for the displaying a selected topic.
 */
class TopicModel {
    /**
     * Returns a new instance of TopicModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * View the selected topic.
     * 
     * @param {Object} req - The request object from Express. 
     * @param {Object} res - The response object from Express.
     */
    async viewTopic(req, res) {
        const { topicId, slug, page } = req.params;
        const member = req.member;
        const topic = TopicRepository.getTopicById(parseInt(topicId, 10));

        if (!topic) {
            throw new Error(LocaleHelper.get('errors', 'topicDoesNotExistOnClick'));
        }

        const forum = ForumRepository.getForumById(topic.getForumId());

        if (!PermissionsService.hasForumPermission(forum.getId(), ForumPermissions.VIEW_FORUM)) {
            throw new Error(LocaleHelper.get('errors', 'invalidViewForumPermissions'));
        }

        ForumsHelper.checkForPassword(res, forum.getId());
        TopicHelper.incrementViews(topic.getId());

        UtilHelper.initializeBreadcrumbs();
        UtilHelper.addBreadcrumb(LocaleHelper.get('forum', 'forumsBreadcrumbTitle'), UtilHelper.buildUrl(), true);
        ForumsHelper.buildForumBreadcrumbs(forum.getId());
        UtilHelper.addBreadcrumb(topic.getTitle(), topic.url());

        DataStoreService.set('showBreadcrumbs', true);

        const totalPosts = TopicHelper.getTotalPostsInTopic(topic.getId());
        const totalPosters = TopicHelper.getTotalUniquePostersInTopic(topic.getId());
        const totalViews = topic.getTotalViews();
        const totalReplies = topic.getTotalReplies();
        const totalAttachments = TopicHelper.getTotalAttachmentsInTopic(topic.getId());

        this.vars.totalPosts = LocaleHelper.replace('topic', `posts${totalPosts === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(totalPosts));
        this.vars.totalPosters = LocaleHelper.replace('topic', `posters${totalPosters === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(totalPosters));
        this.vars.totalViews = LocaleHelper.replace('topic', `views${totalViews === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(totalViews));
        this.vars.totalReplies = LocaleHelper.replace('topic', `replies${totalReplies === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(totalReplies));
        this.vars.totalAttachments = LocaleHelper.replace('topic', `attachments${totalAttachments === 1 ? 'Singular' : ''}`, 'total', UtilHelper.formatNumber(totalAttachments));

        this.vars.topic = topic;
        this.vars.forum = forum;

        const creator = MemberRepository.getMemberById(topic.getCreatedBy());

        this.vars.created = {
            photo: await creator.profilePhoto({ type: 'thumbnail', url: true }),
            name: LocaleHelper.replace('topic', 'createdBy', 'name', creator.link()),
            timestamp: DateTimeHelper.dateFormatter(topic.getCreatedAt(), { timeAgo: true }),
        };

        this.vars.inForum = LocaleHelper.replace('topic', 'inForum', 'forum', forum.link());
        this.vars.permissions = PermissionsService.hasForumPermissions(forum.getId(), [ForumPermissions.CREATE_TOPIC, ForumPermissions.REPLY_TO_TOPIC, ForumPermissions.ATTACH_FILES]);

        this.vars.urls = {
            createTopic: `${UtilHelper.buildUrl(['create', 'topic'])}/${UtilHelper.addIdAndNameToUrl(forum.getId(), forum.getTitle())}`,
        };

        this.vars.totalFollowing = UtilHelper.formatNumber(FollowingHelper.getTotalFollowing('topic', topic.getId()));
        this.vars.isFollowing = FollowingHelper.isFollowing('topic', topic.getId());
        this.vars.isSignedIn = member.isSignedIn();

        this.vars.paginationTop = PaginationHelper.buildPaginationComponent(
            TopicHelper.getTotalPostsInTopic(topic.getId()),
            page ? page : 1,
            member.getPerPage().posts, {
                preUrl: topic.url(),
                nameOfItem: LocaleHelper.get('topic', 'topic'),
                nameOfItems: LocaleHelper.get('topic', 'topics'),
                marginTop: true,
                marginBottom: true,
            }
        );

        this.vars.paginationBottom = PaginationHelper.buildPaginationComponent(
            TopicHelper.getTotalPostsInTopic(topic.getId()),
            page ? page : 1,
            member.getPerPage().posts, {
                preUrl: topic.url(),
                nameOfItem: LocaleHelper.get('topic', 'topic'),
                nameOfItems: LocaleHelper.get('topic', 'topics'),
                marginTop: true,
            }
        );

        const paginationData = PaginationHelper.paginate(TopicHelper.getTotalPostsInTopic(topic.getId()), page ? page : 1, member.getPerPage().posts);
        const cache = CacheProviderFactory.create();
        const posts = cache.get('posts')
            .map(post => PostRepository.getPostById(post.id))
            .filter(post => post.getTopicId() === topic.getId())
            .sort((a, b) => a.getCreatedAt() - b.getCreatedAt());

        const builtPosts = await Promise.all(
            UtilHelper.cutFromArray(posts, paginationData.from, member.getPerPage().posts)
                .map(async (post) => await post.build())
        );

        this.vars.posts = builtPosts.join('');

        const quickReply = await EditorHelper.buildQuickReply({
            formAction: UtilHelper.buildUrl(['post', 'reply', 'topic', topic.getId()]),
            onSubmit: 'return validateReplyToTopic(event, this);',
            dataFields: { topicid: topic.getId() },
            marginTop: true,
            marginBottom: true,
            includeFollow: member.isSignedIn(),
            uploadType: 'attachment',
            includeUploader: this.vars.permissions.attachFiles,
            followWordage: LocaleHelper.get('topic', 'followTopic'),
            buttonWordage: LocaleHelper.get('topic', 'submitReply'),
            initialText: LocaleHelper.get('topic', 'quickReplyText'),
            includeCSRF: Settings.get('csrfEnabled'),
            includeTags: true,
        });

        this.vars.quickReply = quickReply.component;
        this.vars.editorId = quickReply.editorId;
        this.vars.previousNext = TopicHelper.getPreviousAndNextTopics(topic.getId());
        this.vars.browsing = WhosOnlineHelper.getBrowsingComponent('topic', topic.getId());
        this.vars.poll = TopicHelper.buildPoll(topic.getId());

        return this.vars;
    }
}

module.exports = TopicModel;