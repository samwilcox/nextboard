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
 * An entity that represents a single forum permission record.
 */
class ForumPermission {
    /**
     * Constructor that sets up ForumPermission.
     */
    constructor() {
        this.id = null;
        this.forumId = null;
        this.viewForum = {};
        this.createTopic = {};
        this.replyToTopic = {};
        this.editPosts = {};
        this.deletePosts = {};
        this.viewPolls = {};
        this.createPolls = {};
        this.castInPolls = {};
        this.editPolls = {};
        this.likeTopics = {};
        this.likePosts = {};
        this.unlikeTopics = {};
        this.unlikePosts = {};
        this.attachFiles = {};
        this.downloadFiles = {};
        this.markAsSolved = {};
    }

    /**
     * Get the permission identifier.
     * 
     * @returns {number} The permission identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the permission identifier.
     * 
     * @param {number} id - The permission identifier.
     */
    setId(id) {
        this.id = id;
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
     * Get the permissions for users and groups for viewing a forum.
     * 
     * @returns {Object} An object containing the permissions for users and groups for viewing a forum.
     */
    getViewForum() {
        return this.viewForum;
    }

    /**
     * Set the permissions for users and groups for viewing a forum.
     * 
     * @param {Object} viewForum - An object containing the permissions for users and groups for viewing a forum.
     */
    setViewForum(viewForum) {
        this.viewForum = viewForum;
    }

    /**
     * Get the permissions for users and groups for creating a topic.
     * 
     * @returns {Object} An object containing the permissions for users and groups for creating a topic.
     */
    getCreateTopic() {
        return this.createTopic;
    }

    /**
     * Set the permissions for users and groups for creating a topic.
     * 
     * @param {Object} createTopic - An object containing the permissions for users and groups for creating a topic.
     */
    setCreateTopic(createTopic) {
        this.createTopic = createTopic;
    }

    /**
     * Get the permissions for users and groups for replying to a topic.
     * 
     * @returns {Object} An object containing the permissions for users and groups for replying to a topic.
     */
    getReplyToTopic() {
        return this.replyToTopic;
    }

    /**
     * Set the permissions for users and groups for replying to a topic.
     * 
     * @param {Object} replyToTopic - An object containing the permissions for users and groups for replying to a topic.
     */
    setReplyToTopic(replyToTopic) {
        this.replyToTopic = replyToTopic;
    }

    /**
     * Get the permissions for users and groups for editing posts.
     * 
     * @returns {Object} An object containing the permissions for users and groups for editing posts.
     */
    getEditPosts() {
        return this.editPosts;
    }

    /**
     * Set the permissions for users and groups for editing posts.
     * 
     * @param {Object} editPosts - An object containing the permissions for users and groups for editing posts.
     */
    setEditPosts(editPosts) {
        this.editPosts = editPosts;
    }

    /**
     * Get the permissions for users and groups for deleting posts.
     * 
     * @returns {Object} An object containing the permissions for users and groups for deleting posts.
     */
    getDeletePosts() {
        return this.deletePosts;
    }

    /**
     * Set the permissions for users and groups for deleting posts.
     * 
     * @param {Object} deletePosts - An object containing the permissions for users and groups for deleting posts.
     */
    setDeletePosts(deletePosts) {
        this.deletePosts = deletePosts;
    }

    /**
     * Get the permissions for users and groups for viewing polls.
     * 
     * @returns {Object} An object containing the permissions for users and groups for viewing polls.
     */
    getViewPolls() {
        return this.viewPolls;
    }

    /**
     * Set the permissions for users and groups for viewing polls.
     * 
     * @param {Object} viewPolls - An object containing the permissions for users and groups for viewing polls.
     */
    setViewPolls(viewPolls) {
        this.viewPolls = viewPolls;
    }

    /**
     * Get the permissions for users and groups for creating polls.
     * 
     * @returns {Object} An object containing the permissions for users and groups for creating polls.
     */
    getCreatePolls() {
        return this.createPolls;
    }

    /**
     * Set the permissions for users and groups for creating polls.
     * 
     * @param {Object} createPolls - An object containing the permissions for users and groups for creating polls.
     */
    setCreatePolls(createPolls) {
        this.createPolls = createPolls;
    }

    /**
     * Get the permissions for users and groups for casting votes in polls.
     * 
     * @returns {Object} An object containing the permissions for users and groups for casting votes in polls.
     */
    getCastInPolls() {
        return this.castInPolls;
    }

    /**
     * Set the permissions for users and groups for casting votes in polls.
     * 
     * @param {Object} castInPolls - An object containing the permissions for users and groups for casting votes in polls.
     */
    setCastInPolls(castInPolls) {
        this.castInPolls = castInPolls;
    }

    /**
     * Get the permissions for users and groups for editing polls.
     * 
     * @returns {Object} An object containing the permissions for users and groups for editing polls.
     */
    getEditPolls() {
        return this.editPolls;
    }

    /**
     * Set the permissions for users and groups for editing polls.
     * 
     * @param {Object} editPolls - An object containing the permissions for users and groups for editing polls.
     */
    setEditPolls(editPolls) {
        this.editPolls = editPolls;
    }

    /**
     * Get the permissions for users and groups for liking topics.
     * 
     * @returns {Object} An object containing the permissions for users and groups for liking topics.
     */
    getLikeTopics() {
        return this.likeTopics;
    }

    /**
     * Set the permissions for users and groups for liking topics.
     * 
     * @param {Object} likeTopics - An object containing the permissions for users and groups for liking topics.
     */
    setLikeTopics(likeTopics) {
        this.likeTopics = likeTopics;
    }

    /**
     * Get the permissions for users and groups for liking posts.
     * 
     * @returns {Object} An object containing the permissions for users and groups for liking posts.
     */
    getLikePosts() {
        return this.likePosts;
    }

    /**
     * Set the permissions for users and groups for liking posts.
     * 
     * @param {Object} likePosts - An object containing the permissions for users and groups for liking posts.
     */
    setLikePosts(likePosts) {
        this.likePosts = likePosts;
    }

    /**
     * Get the permissions for users and groups for unliking topics.
     * 
     * @returns {Object} An object containing the permissions for users and groups for unliking topics.
     */
    getUnlikeTopics() {
        return this.unlikeTopics;
    }

    /**
     * Set the permissions for users and groups for unliking topics.
     * 
     * @param {Object} unlikeTopics - An object containing the permissions for users and groups for unliking topics.
     */
    setUnlikeTopics(unlikeTopics) {
        this.unlikeTopics = unlikeTopics;
    }

    /**
     * Get the permissions for users and groups for unliking posts.
     * 
     * @returns {Object} An object containing the permissions for users and groups for unliking posts.
     */
    getUnlikePosts() {
        return this.unlikePosts;
    }

    /**
     * Set the permissions for users and groups for unliking posts.
     * 
     * @param {Object} unlikePosts - An object containing the permissions for users and groups for unliking posts.
     */
    setUnlikePosts(unlikePosts) {
        this.unlikePosts = unlikePosts;
    }

    /**
     * Get the permissions for users and groups for attaching files.
     * 
     * @returns {Object} An object containing the permissions for users and groups for attaching files.
     */
    getAttachFiles() {
        return this.attachFiles;
    }

    /**
     * Set the permissions for users and groups for attaching files.
     * 
     * @param {Object} attachFiles - An object containing the permissions for users and groups for attaching files.
     */
    setAttachFiles(attachFiles) {
        this.attachFiles = attachFiles;
    }

    /**
     * Get the permissions for users and groups for downloading files.
     * 
     * @returns {Object} An object containing the permissions for users and groups for downloading files.
     */
    getDownloadFiles() {
        return this.downloadFiles;
    }

    /**
     * Set the permissions for users and groups for downloading files.
     * 
     * @param {Object} downloadFiles - An object containing the permissions for users and groups for downloading files.
     */
    setDownloadFiles(downloadFiles) {
        this.downloadFiles = downloadFiles;
    }

    /**
     * Get the permissions for users and groups for marking topics as solved.
     * 
     * @returns {Object} An object containing the permissions for users and groups for marking topics as solved.
     */
    getMarkAsSolved() {
        return this.markAsSolved;
    }

    /**
     * Set the permissions for users and groups for marking topics as solved.
     * 
     * @param {Object} markAsSolved - An object containing the permissions for users and groups for marking topics as solved.
     */
    setMarkAsSolved(markAsSolved) {
        this.markAsSolved = markAsSolved;
    }
}

module.exports = ForumPermission;