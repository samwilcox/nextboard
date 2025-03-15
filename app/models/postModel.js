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

const TopicRepository = require("../repository/topicRepository");
const PermissionsService = require('../services/permissionsService');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const ForumPermissions = require("../types/forumPermissions");
const LocaleHelper = require("../helpers/localeHelper");
const UtilHelper = require("../helpers/utilHelper");
const DateTimeHelper = require("../helpers/dateTimeHelper");
const ForumRepository = require("../repository/forumRepository");
const FollowingHelper = require("../helpers/followingHelper");
const PostsHelper = require("../helpers/postsHelper");
const TagsHelper = require("../helpers/tagsHelper");

/**
 * Model for the posting.
 */
class PostModel {
    /**
     * Returns a new instance of PostModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Post a reply to a topic.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     */
    async postReplyToTopic(req, res) {
        const { topicId } = req.params;
        const { editor, attachments, follow, tags } = req.body;
        const topic = TopicRepository.getTopicById(parseInt(topicId, 10));

        if (!topic) {
            throw new Error(LocaleHelper.get('errors', 'topicNotFoundOnReply'));
        }

        if (editor === '<p></p>') {
            throw new Error(LocaleHelper.get('errors', 'textBodyMissing'));
        }

        const canPostReply = PermissionsService.hasForumPermission(ForumPermissions.REPLY_TO_TOPIC);

        if (!canPostReply) {
            throw new Error(LocaleHelper.get('errors', 'invalidPostReplyPermissions'));
        }

        let attachmentsList = null, tagsList = null;

        if (attachments !== '') {
            attachmentsList = attachments;
        }

        if (tags !== '') {
            const parsedTags = JSON.parse(tags);
            tagsList = await TagsHelper.tagNamesToIdentifiers(parsedTags);
        }

        const safeContent = UtilHelper.sanitizeHtml(editor);
        const member = req.member;
        const date = new Date();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        const result = await db.query(builder
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
                topic.getCategoryId(),
                topic.getForumId(),
                topic.getId(),
                member.getId(),
                DateTimeHelper.dateToEpoch(date),
                safeContent,
                tagsList ? JSON.stringify(tagsList) : null,
                attachmentsList,
                0,
                UtilHelper.getUserIp(req),
                req.hostname,
                req.headers['user-agent'],
                1
            ])
            .build()
        );

        const postId = result.insertId;
        let totalReplies = topic.getTotalReplies();
        totalReplies++;

        await db.query(builder
            .clear()
            .update('topics')
            .set(['totalReplies', 'lastPostId'], [totalReplies, postId])
            .where('id = ?', [topic.getId()])
            .build()
        );

        const forum = ForumRepository.getForumById(topic.getForumId());
        let totalPosts = forum.getTotalPosts();
        totalPosts++;

        await db.query(builder
            .clear()
            .update('forums')
            .set(['totalPosts', 'lastPostId'], [totalPosts, postId])
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
                FollowingHelper.followContent('topic', topic.getId());
            }
        }

        await cache.updateAll(['posts', 'topics', 'forums']);

        res.redirect(PostsHelper.getLinkToPostById(postId));
    }
}

module.exports = PostModel;