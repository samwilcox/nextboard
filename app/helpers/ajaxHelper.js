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

const LikeHelper = require('./likeHelper');
const UtilHelper = require('./utilHelper');
const LocaleHelper = require('./localeHelper');
const Settings = require('../settings');
const axios = require('axios');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const { UploadHelper } = require('./uploadHelper');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const path = require('path');
const FileHelper = require('./fileHelper');
const OutputHelper = require('./outputHelper');
const TopicRepository = require('../repository/topicRepository');
const PermissionsService = require('../services/permissionsService');
const ForumPermissions = require('../types/forumPermissions');
const TopicHelper = require('./topicHelper');

/**
 * Helpers for AJAX related tasks.
 */
class AjaxHelper {
    /**
     * Build the AJAX response object.
     * 
     * @param {boolean} success - True if response is successful, false if unsuccessful.
     * @param {Object} [data={}] - An object containing the data to send.
     * @returns {Object} The resulting response object. 
     */
    static buildResponse(success, data = {}) {
        return {
            success: success,
            data,
        };
    }

    /**
     * Helper that helps with liking/unliking content.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the resulting JSON.
     */
    static async likeUnlikeContent(req) {
        const { mode, contentType, contentId } = req.body;

        if (!UtilHelper.isContentValid(contentType, contentId)) {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', 'ajaxContentNotValid') });
        }

        let result;

        switch (mode) {
            case 'like':
                result = await LikeHelper.likeContent(contentType, contentId);
                break;
            case 'unlike':
                result = await LikeHelper.unlikeContent(contentType, contentId);
                break;
            default:
                return this.buildResponse(false, { message: LocaleHelper.get('errors', 'ajaxLikeUnlikeModeInvalid') });
        }

        if (result) {
            const updatedLikeListing = await LikeHelper.getLikeListing(contentType, contentId);
            const updatedLikeButton = await LikeHelper.getLikeButtonForContent(contentType, contentId);

            UtilHelper.registerDialog(updatedLikeListing, { overwrite: true });

            return this.buildResponse(true, {
                link: updatedLikeButton,
                dialog: updatedLikeListing,
            });
        } else {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', 'ajaxFailedToLikeContent') });
        }
    }

    /**
     * Helper that gets the list of emoticons.
     * 
     * @param {string|null} [category=null] - The category name to get emoticons for (leave null for all emoticons).
     * @returns {Object} An object containing the resulting JSON. 
     */
    static getEmoticons(category = null) {
        const emoticons = Settings.get('emoticons');
        
        if (category) {
            category = decodeURIComponent(category);

            if (emoticons.some(emoticon => emoticon.category === category)) {
                return this.buildResponse(true, emoticons[category]);
            } else {
                return this.buildResponse(true, emoticons);
            }
        } else {
            return this.buildResponse(true, emoticons);
        }
    }

    /**
     * Get the Rumble ID.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {string|null} - The Rumble embed identifier or null if not found.
     */
    static async getRumbleEmbedId(req) {
        const videoId = req.query.id;
        const documentId = req.query.documentid;
    
        if (!videoId) {
            return null;
        }

        const response = await axios.get(`https://rumble.com/${videoId}-${documentId}`, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });

        const embedHTML = response.data.match(/href="https:\/\/rumble\.com\/api\/Media\/oembed\.json\?url=https%3A%2F%2Frumble\.com%2Fembed%2F([a-zA-Z0-9_-]+)/);

        if (embedHTML && embedHTML[1]) {
            return embedHTML[1];
        } else {
            return null;
        }
    }

    /**
     * Search for tags.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the matching tags. 
     */
    static searchTags(req) {
        const { input } = req.query;
        const cache = CacheProviderFactory.create();
        const tags = cache.get('tags') || [];

        const matchingTags = tags.filter(tag => tag.title.toLowerCase().includes(input.toLowerCase()));

        return this.buildResponse(true, { haveTags: matchingTags.length > 0, tags: matchingTags });
    }

    /**
     * Upload a file.
     * 
     * @param {Object} req - The request object from Express.
     */
    static async uploadFile(req) {
        const result = await UploadHelper.uploadFile(req.file, req.body.uploaderId, req.body.uploadType);

        if (!result.success) {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', 'ajaxFileUploadFailed') });
        }

        return this.buildResponse(true, result);
    }

    /**
     * Deletes a selected file.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The JSON response object.
     */
    static async deleteUploadedFile(req) {
        const { type, id } = req.body;
        const member = req.member;
        return await this.deleteFile(id, member, type);
    }

    /**
     * Deletes the specified file.
     * 
     * @param {number} id - The uploaded file identifier.
     * @param {Member} member - The member entity instance.
     * @param {"attachment"|"photo"|"cover"} [uploadType='attachment'] - The upload type (e.g., 'attachment').
     * @returns {Object} The JSON object.
     */
    static async deleteFile(id, member, uploadType = 'attachment') {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        const typeToCacheLegend = { attachment: 'member_attachments', photo: 'member_photos', cover: 'member_cover_photos' };
        const notFoundLegend = { attachment: 'attachmentNotFound', photo: 'photoNotFound', cover: 'coverNotFound' };
        const deleteFailedLegend = { attachment: 'attachmentDeleteFailed', photo: 'photoDeleteFailed', cover: 'coverDeleteFailed' };

        const data = cache.get(typeToCacheLegend[uploadType]).find(i => i.id === parseInt(id, 10));
        const exists = data ? true : false;

        if (!exists) {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', notFoundLegend[uploadType]) });
        }

        const fileName = data.fileName;
        const uploadPath = UploadHelper.getUploadPath('attachment', member);
        const filePath = path.join(uploadPath, fileName);

        try {
            FileHelper.deleteFile(filePath);
        } catch (error) {
            return this.buildResponse(false, { message: LocaleHelper.replace('errors', deleteFailedLegend[uploadType], 'error', error) });
        }

        await db.query(builder
            .clear()
            .deleteFrom(typeToCacheLegend[uploadType])
            .where('id = ?', [id])
            .build()
        );

        await cache.update(typeToCacheLegend[uploadType]);

        return this.buildResponse(true);
    }

    /**
     * Get the specified poll option template.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the JSON data.
     */
    static pollOptions(req) {
        const { question, option } = req.query;

        if (question && (!option || option === undefined)) {
            return this.buildPollQuestion(parseInt(question, 10));
        } else if (question && option) {
            return this.buildPollOption(question, option);
        }
    }

    /**
     * Builds a poll question.
     * 
     * @param {number} number - The poll question number.
     * @returns {Object} An object containing the JSON data.
     */
    static buildPollQuestion(number) {
        return this.buildResponse(true, {
            item: OutputHelper.getPartial('ajaxHelper', 'poll-question', {
                number,
                questionTitle: LocaleHelper.replace('ajaxHelper', 'questionTitle', 'number', number),
                optionTitleOne: LocaleHelper.replace('ajaxHelper', 'optionTitle', 'number', 1),
                optionTitleTwo: LocaleHelper.replace('ajaxHelper', 'optionTitle', 'number', 2),
            }),
            type: 'question',
        });
    }

    /**
     * Builds a poll option.
     * 
     * @param {number} questionNumber - The question number.
     * @param {number} optionNumber - The option number.
     * @returns {Object} An object containing the JSON data.
     */
    static buildPollOption(questionNumber, optionNumber) {
        return this.buildResponse(true, {
            item: OutputHelper.getPartial('ajaxHelper', 'poll-option', {
                questionNumber,
                optionNumber,
                optionTitle: LocaleHelper.replace('ajaxHelper', 'optionTitle', 'number', optionNumber),
            }),
            type: 'option',
        });
    }

    /**
     * Cast a vote in the given poll.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing the JSON data.
     */
    static async castPoll(req) {
        const {
            topicId,
            cast = true,
            pollData,
        } = req.body;

        const topic = TopicRepository.getTopicById(parseInt(topicId, 10));

        if (!topic) {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', 'topicNotFound') });
        }

        if (!PermissionsService.hasForumPermission(ForumPermissions.CAST_IN_POLLS)) {
            return this.buildResponse(false, { message: LocaleHelper.get('errors', 'invalidCastInPollsPermissions') });
        }

        const member = req.member;
        const poll = JSON.parse(pollData);
        const originalPollData = topic.getPoll();

        for (const questionKey in poll) {
            const options = poll[questionKey].options;

            for (const optionKey in options) {
                if (options[optionKey]) {
                    originalPollData.questions[questionKey].voters[optionKey].push(member.getId());

                    if (cast) {
                        let totalVotes = originalPollData.questions[questionKey].votes[optionKey];
                        totalVotes++;
                        originalPollData.questions[questionKey].votes[optionKey] = totalVotes;
                    }
                }
            }
        }

        topic.setPoll(originalPollData);

        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        await db.query(builder
            .clear()
            .update('topics')
            .set(['poll'], [JSON.stringify(originalPollData)])
            .where('id = ?', [topic.getId()])
            .build()
        );

        await cache.update('topics');

        return this.buildResponse(true, {
            poll: TopicHelper.buildPoll(topic.getId()),
        });
    }
}

module.exports = AjaxHelper;