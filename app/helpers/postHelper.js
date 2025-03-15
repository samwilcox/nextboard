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

const LikeHelper = require("./likeHelper");
const PostRepository = require('../repository/postRepository');

/**
 * Helpers for post-related tasks.
 */
class PostHelper {
    /**
     * Get the total likes for a given post.
     * 
     * @param {number} postId - The post identifier.
     * @returns {number} The total number of likes.
     */
    static getTotalLikes(postId) {
        const total = 0;
        return LikeHelper.getTotalLikes('post', postId);
    }

    /**
     * Get the post entity for the given identifier.
     * 
     * @param {number} postId - The post identifier.
     * @returns {Post|null} The resulting Post entity or null if not found.  
     */
    static getPost(postId) {
        const post = PostRepository.getPostById(postId);
        if (!post) return null;
        return post;
    }
}

module.exports = PostHelper;