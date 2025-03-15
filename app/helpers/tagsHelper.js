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
const DatabaseProviderFactory = require("../data/db/databaseProviderFactory");
const QueryBuilder = require("../data/db/queryBuilder");
const TagRepository = require("../repository/tagRepository");
const MemberService = require("../services/memberService");
const DateTimeHelper = require("./dateTimeHelper");
const LocaleHelper = require("./localeHelper");
const UtilHelper = require("./utilHelper");

/**
 * TagsHelper helpers to help manage tag related tasks.
 */
class TagsHelper {
    /**
     * Get the tag identifier by the tag name.
     * 
     * @param {string} tagName - The tag name.
     * @returns {number|null} The tag identifier or null if the tag is not found.
     */
    static getTagIdByName(tagName) {
        const cache = CacheProviderFactory.create();
        const tags = cache.get('tags').find(tag => tag.title === tagName);
        const exists = tags ? true : false;
        if (!exists) return null;
        return tags.id;
    }

    /**
     * Get an array of tag identifiers for the given array of tag titles.
     * 
     * @param {string[]} tagNames - An array of various tag titles.
     * @returns {number[]} The resulting array of corresponding tag identifiers. 
     */
    static async tagNamesToIdentifiers(tagNames) {
        if (!tagNames || !Array.isArray(tagNames)) {
            throw new Error(LocaleHelper.get('errors', 'invalidTagNamesArray'));
        }

        const tagIdentifiers = [];

        for (const name of tagNames) {
            const id = this.getTagIdByName(name);

            if (id) {
                tagIdentifiers.push(id);
            } else {
                const cache = CacheProviderFactory.create();
                const db = DatabaseProviderFactory.create();
                const builder = new QueryBuilder();
                const member = MemberService.getMember();

                const result = await db.query(builder
                    .clear()
                    .insertInto('tags', [
                        'title', 'createdBy', 'createdAt'
                    ], [
                        name, member.getId(), DateTimeHelper.dateToEpoch(new Date())
                    ])
                    .build()
                );

                await cache.update('tags');

                tagIdentifiers.push(result.insertId);
            }
        };

        return tagIdentifiers;
    }

    /**
     * Convert an array of tag identifiers to an array of tag entities.
     * 
     * @param {number[]} tagIdentifiers - An array of tag identifiers.
     * @returns {Tag[]} - An array of the corresponding tag entities. 
     */
    static tagIdentifiersToEntities(tagIdentifiers) {
        if (!tagIdentifiers || !Array.isArray(tagIdentifiers)) {
            throw new Error(LocaleHelper.get('errors', 'invalidTagIdentifiersArray'));
        }

        return tagIdentifiers.map(tag => TagRepository.getTagById(tag));
    }

    /**
     * Get the data for the tags for the BBIC center.
     * 
     * @returns {Object[]|null} An array of tag objects or null if there are no tags.
     */
    static getTagsBBICData() {
        const member = MemberService.getMember();
        const tagSettings = member.getBBIC();
        const maxTags = tagSettings.maxTags;
        const cache = CacheProviderFactory.create();

        const tags = cache.get('tags')
            .map(tag => TagRepository.getTagById(tag.id))
            .sort((a, b) => b.getCreatedAt() - a.getCreatedAt());

        const slicedTags = tags.slice(0, maxTags);
        const tagObjects = [];

        if (slicedTags.length === 0) return null;

        slicedTags.forEach(tag => {
            tagObjects.push({
                title: tag.getTitle(),
                url: tag.url(),
                size: UtilHelper.getRandomNumber(tagSettings.tagMinFontSize, tagSettings.tagMaxFontSize),
            });
        });

        return tagObjects;
    }
}

module.exports = TagsHelper;