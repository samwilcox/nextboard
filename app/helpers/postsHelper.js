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
const PostRepository = require("../repository/postRepository");
const TopicRepository = require("../repository/topicRepository");
const MemberService = require("../services/memberService");
const AttachmentRepository = require('../repository/attachmentRepository');

/**
 * Helpers for handling posts.
 */
class PostsHelper {
    /**
     * Get a post entity by its identifier.
     * 
     * @param {number} postId - The post identifier.
     * @returns {Post|null} The post entity instance or null if not found.
     */
    static getPostEntityById(postId) {
        return PostRepository.getPostById(postId);
    }

    /**
     * Get the URL link to the given post.
     * 
     * @param {number} postId - The post identifier.
     * @returns {string|null} The URL address to the new post or null if the post is not found.
     */
    static getLinkToPostById(postId) {
        const post = PostRepository.getPostById(postId);
        if (!post) return null;

        const postNumber = post.getPostNumber();
        const perPage = MemberService.getMember().getPerPage().posts;
        const cache = CacheProviderFactory.create();

        const posts = cache.get('posts')
            .map(post => PostRepository.getPostById(post.id))
            .filter(post => post.getTopicId() === post.getTopicId())
            .sort((a, b) => a.getCreatedAt() - b.getCreatedAt());
        
        const postIndex = posts.findIndex(post => post.getId() === postId);
        if (!postIndex === -1) return null;
        const pageNumber = Math.floor(postIndex / perPage) + 1;
        const topic = TopicRepository.getTopicById(post.getTopicId());

        return `${topic.url()}/page/${pageNumber}/#postnumber-${postNumber}`;
    } 

    /**
     * Convert a given attachments object array to an attachment entities array.
     * 
     * @param {Object[]} attachments - An array of attachment objects.
     * @param {number} forumId - The forum identifier.
     * @returns {Attachment[]|null} An array of attachment entities or null if no attachments. 
     */
    static attachmentsToEntities(attachments, forumId) {
        if (!attachments) return null;
        const entities = [];

        attachments.forEach(attachment => {
            const entity = AttachmentRepository.getAttachmentById(attachment.id);

            if (entity) {
                entity.setForumId(forumId);
                entities.push(entity);
            }
        });

        return entities;
    }
}

module.exports = PostsHelper;