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

const ForumRepository = require("../repository/forumRepository");
const NotFoundError = require('../errors/notFoundError');
const InvalidPermissionsError = require('../errors/invalidPermissionsError');
const RequiredFieldError = require('../errors/requiredFieldError');
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require("../types/forumPermissions");
const UtilHelper = require("../helpers/utilHelper");
const ForumsHelper = require("../helpers/forumsHelper");
const dataStoreService = require("../services/dataStoreService");
const EditorHelper = require('../helpers/editorHelper');
const UploaderHelper = require('../helpers/uploaderHelper');
const TagsHelper = require('../helpers/tagsHelper');
const CacheProviderFactory = require("../data/cache/cacheProviderFactory");
const DatabaseProviderFactory = require("../data/db/databaseProviderFactory");
const QueryBuilder = require("../data/db/queryBuilder");
const DateTimeHelper = require("../helpers/dateTimeHelper");
const FollowingHelper = require('../helpers/followingHelper');
const PostsHelper = require('../helpers/postsHelper');

/**
 * Model for creating content.
 */
class CreateModel {
    /**
     * Returns a new instance of CreateModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Create a new topic form page.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {any[]} The resulting vars array.
     */
    async createTopicForm(req) {
        const { forumId, slug } = req.params;
        const locale = req.locale;
        const member = req.member;
        const forum = ForumRepository.getForumById(parseInt(forumId, 10));
        const now = new Date();

        if (!forum) {
            throw new NotFoundError(locale.errors.forumDoesNotExistForNewTopic);
        }

        if (!PermissionsService.hasForumPermission(forum.getId(), ForumPermissions.CREATE_TOPIC)) {
            throw new InvalidPermissionsError(locale.errors.invalidCreateNewTopicPermissions);
        }

        const pollExpiration = forum.getPoll().expiration;
        const pollPeriod = pollExpiration.futurePeriod;

        UtilHelper.initializeBreadcrumbs();
        UtilHelper.addBreadcrumb(locale.forum.forumsBreadcrumbTitle, UtilHelper.buildUrl(), true);
        ForumsHelper.buildForumBreadcrumbs(forum.getId());
        UtilHelper.addBreadcrumb(locale.create.createNewTopicBreadcrumb, `${UtilHelper.buildUrl(['create', 'topic'])}/${UtilHelper.addIdAndNameToUrl(forum.getId(), forum.getTitle())}`);
        dataStoreService.set('showBreadcrumbs', true);

        this.vars.action = UtilHelper.buildUrl(['create', 'topic', forum.getId()]);
        this.vars.editor = EditorHelper.build();
        this.vars.permissions = PermissionsService.hasForumPermissions(forum.getId(), [ForumPermissions.CREATE_POLLS, ForumPermissions.ATTACH_FILES, ForumPermissions.FOLLOW_TOPICS]);
        this.vars.uploader = UploaderHelper.build();
        this.vars.member = member;
        this.vars.tags = UtilHelper.buildTagsInput({ id: this.vars.editor.id });

        const dateTime = DateTimeHelper.getFutureDate({
            seconds: pollPeriod.seconds,
            minutes: pollPeriod.minutes,
            hours: pollPeriod.hours,
            days: pollExpiration.enabled ? pollPeriod.days : 7,
            weeks: pollPeriod.weeks,
            months: pollPeriod.months,
            years: pollPeriod.years,
        });

        this.vars.defaultDateTime = dateTime.toISOString().slice(0, 16);
        this.vars.pollMaxQuestions = forum.getPoll().maxQuestions;
        this.vars.pollMaxOptions = forum.getPoll().maxOptions;

        return this.vars;
    }

    /**
     * Process a new topic.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async processNewTopic(req, res) {
        const { forumId } = req.params;

        const {
            title,
            editor,
            attachments,
            follow,
            tags,
            includesignature,
            poll,
        } = req.body;

        const forum = ForumRepository.getForumById(parseInt(forumId, 10));

        if (!forum) {
            throw new NotFoundError(locale.errors.forumDoesNotExistForNewTopic);
        }

        if (!PermissionsService.hasForumPermission(forum.getId(), ForumPermissions.CREATE_TOPIC)) {
            throw new InvalidPermissionsError(locale.errors.invalidCreateNewTopicPermissions);
        }

        const member = req.member;
        const locale = req.locale;

        if (!title || title.length === 0) {
            throw new RequiredFieldError(locale.errors.topicTitleMissing);
        }

        if (!editor || editor === '<p></p>') {
            throw new RequiredFieldError(locale.errors.textBodyMissing);
        }

        let attachmentsList = null, tagsList = null, pollData = null;

        if (attachments !== '') {
            attachmentsList = attachments;
        }

        if (tags !== '') {
            const parsedTags = JSON.parse(tags);
            tagsList = await TagsHelper.tagNamesToIdentifiers(parsedTags);
        }

        if (poll.length > 0) {
            pollData = JSON.parse(poll);
            pollData.closed = false;
            pollData.closedAt = null;

            for (const questionKey in pollData.questions) {
                const options = pollData.questions[questionKey];

                for (const optionKey in options.options) {
                    if (!options.hasOwnProperty('votes')) {
                        options.votes = {};
                    }

                    if (!options.hasOwnProperty('voters')) {
                        options.voters = {};
                    }

                    options.votes[optionKey] = 0;
                    options.voters[optionKey] = [];
                }
            }

            pollData = JSON.stringify(pollData);
        }

        const safeContent = UtilHelper.sanitizeHtml(editor);
        const date = DateTimeHelper.dateToEpoch(new Date());
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        let result;

        result = await db.query(builder
            .clear()
            .insertInto('topics', [
                'categoryId',
                'forumId',
                'title',
                'createdBy',
                'createdAt',
                'locked',
                'totalReplies',
                'totalViews',
                'lastPostId',
                'answered',
                'answeredData',
                'pinned',
                'pinnedAt',
                'pinnedBy',
                'tags',
                'poll'
            ], [
                forum.getCategoryId(),
                forum.getId(),
                title,
                member.getId(),
                date,
                0,
                0,
                0,
                0,
                0,
                null,
                0,
                null,
                null,
                tagsList ? JSON.stringify(tagsList) : null,
                pollData
            ])
            .build()
        );

        const topicId = result.insertId;

        result = await db.query(builder
            .clear()
            .insertInto('posts', [
                'categoryId',
                'forumId',
                'topicId',
                'createdBy',
                'createdAt',
                'content',
                'tags',
                'attachments',
                'isFirstPost',
                'ipAddress',
                'hostname',
                'userAgent',
                'includeSignature'
            ], [
                forum.getCategoryId(),
                forum.getId(),
                topicId,
                member.getId(),
                date,
                safeContent,
                tagsList ? JSON.stringify(tagsList) : null,
                attachmentsList,
                1,
                UtilHelper.getUserIp(req),
                req.hostname,
                req.headers['user-agent'],
                includesignature ? (parseInt(includesignature, 10) === 1 ? 1 : 0) : 0
            ])
            .build()
        );

        const postId = result.insertId;

        await db.query(builder
            .clear()
            .update('topics')
            .set(['lastPostId'], [postId])
            .where('id = ?', [topicId])
            .build()
        );

        const totalTopics = forum.getTotalTopics() + 1;
        const totalPosts = forum.getTotalPosts() + 1;
        forum.setTotalTopics(totalTopics);
        forum.setTotalPosts(totalPosts);

        await db.query(builder
            .clear()
            .update('forums')
            .set([
                'totalTopics',
                'totalPosts',
                'lastPostId'
            ], [
                totalTopics,
                totalPosts,
                postId
            ])
            .where('id = ?', [forum.getId()])
            .build()
        );

        if (member.isSignedIn()) {
            let totalPosts = member.getTotalPosts();
            totalPosts++;
            member.setTotalPosts(totalPosts);

            await db.query(builder
                .clear()
                .update('members')
                .set(['totalPosts'], [totalPosts])
                .where('id = ?', [member.getId()])
            );

            await cache.update('members');

            if (follow && parseInt(follow, 10) === 1) {
                FollowingHelper.followContent('topic', topicId);
            }
        }

        await cache.updateAll(['forums', 'topics', 'posts']);

        res.redirect(PostsHelper.getLinkToPostById(postId));
    }
}

module.exports = CreateModel;