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

/**
 * NextBoard forum permissions.
 */
const ForumPermissions = Object.freeze({
    VIEW_FORUM: 'viewForum',
    CREATE_TOPIC: 'createTopic',
    REPLY_TO_TOPIC: 'replyToTopic',
    EDIT_POSTS: 'editPosts',
    DELETE_POSTS: 'deletePosts',
    VIEW_POLLS: 'viewPolls',
    CREATE_POLLS: 'createPolls',
    CAST_IN_POLLS: 'castInPolls',
    EDIT_POLLS: 'editPolls',
    CLOSE_POLLS: 'closePolls',
    CLOSE_OWN_POLLS: 'closeOwnPolls',
    OPEN_CLOSED_POLLS: 'openClosedPolls',
    OPEN_OWN_CLOSED_POLLS: 'openOwnClosedPolls',
    LIKE_TOPICS: 'likeTopics',
    LIKE_POSTS: 'likePosts',
    UNLIKE_TOPICS: 'unlikeTopics',
    UNLIKE_POSTS: 'unlikePosts',
    ATTACH_FILES: 'attachFiles',
    DOWNLOAD_FILES: 'downloadFiles',
    MARK_AS_SOLVED: 'markAsSolved',
    FOLLOW_TOPICS: 'followTopics',
});

module.exports = ForumPermissions;