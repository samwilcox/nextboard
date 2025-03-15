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

const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const CategoryRepository = require('../repository/categoryRepository');
const ForumRepository = require('../repository/forumRepository');
const LocaleHelper = require('./localeHelper');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require('./dateTimeHelper');
const CookieHelper = require('./cookieHelper');
const CookieList = require('../lists/CookieList');
const UtilHelper = require('./utilHelper');
const OutputHelper = require('./outputHelper');
const WhosOnlineHelper = require('./whosOnlineHelper');

/**
 * Helpers for building and managing forum related tasks.
 */
class ForumsHelper {
    /**
     * Build categories and/or forums.
     * 
     * @param {Object} [options={}] - Options for building categories/forums.
     * @param {number} [options.categoryId=null] - Specify a category identifier to just retreive that category along with its forums (default is null).
     * @param {number} [options.forumId=null] - Specify a forum identifier to retreive the sub forums for that forum (default is null).
     * @returns {Object} An object containing all the retreived categories and/or forums.
     */
    static async build(options = {}) {
        const { categoryId = null, forumId = null } = options;
        const built = { categories: [], forums: [], haveCategories: false, haveForums: false };
        const cache = CacheProviderFactory.create();
        
        if (!categoryId && !forumId) {
            const data = cache.getAll({ categories: 'categories', forums: 'forums' });
            const categories = data.categories
                .map(category => CategoryRepository.getCategoryById(category.id))
                .sort((a, b) => a.getSortOrder() - b.getSortOrder());

            if (categories.length > 0) {
                built.haveCategories = true;

                built.categories = await Promise.all(
                    categories
                        .filter(category => category.isVisible())
                        .map(async category => {
                            const categoryObj = {
                                entity: category,
                                forums: data.forums
                                    .map(forum => ForumRepository.getForumById(forum.id))
                                    .filter(forum => forum.getCategoryId() === category.getId() && forum.isVisible())
                                    .sort((a, b) => a.getSortOrder() - b.getSortOrder())
                            };

                            categoryObj.builtForums = [];
                            categoryObj.builtForums = await Promise.all(categoryObj.forums.map(forum => forum.build()));
                
                            if (categoryObj.forums.length > 0) built.haveForums = true;
                            return categoryObj;
                        })
                );
            }
        } else if (!categoryId && forumId) {
            const forums = cache.get('forums')
                .map(forum => ForumRepository.getForumById(forum.id))
                .filter(forum => forum.getHasParent() && forum.getParentId() === forumId && forum.isVisible())
                .sort((a, b) => a.getSortOrder() - b.getSortOrder());

            if (forums.length > 0) built.haveForums = true;
            built.forums = forums;
        }

        return built;
    }

    /**
     * Build the breadcrumbs from the given forum.
     * 
     * @param {number} forumId - The forum identifier.
     */
    static buildForumBreadcrumbs(forumId) {
        const breadcrumbs = [];

        const recurseForums = (currentForumId) => {
            const forum = ForumRepository.getForumById(currentForumId);

            if (!forum) return;

            breadcrumbs.push({
                title: forum.getTitle(),
                url: forum.url(),
            });

            if (forum.getHasParent()) {
                recurseForums(forum.getParentId());
            }
        };

        recurseForums(forumId);

        breadcrumbs.forEach(crumb => {
            UtilHelper.addBreadcrumb(crumb.title, crumb.url);
        });
    }

    /**
     * Check if a given forum exists.
     * 
     * @param {number} forumId - The identifier of the forum to check.
     * @returns {boolean} True if the forum exists, false if it does not.
     */
    static forumExists(forumId) {
        const cache = CacheProviderFactory.create();
        return cache.get('forums').find(forum => forum.id === parseInt(forumId)) ? true : false;
    }

    /**
     * Checks the given forum if it requires a password.
     * If it does require a password, the user will be redirected to the page to enter the password.
     * If no password is required, does nothing.
     * 
     * @param {Object} res - The response object from Express.
     * @param {number} forumId - The forum identifier.
     */
    static checkForPassword(res, forumId) {
        const forum = ForumRepository.getForumById(forumId);

        if (!forum) {
            throw new Error(LocaleHelper.get('errors', 'forumDoesNotExistForPassword'));
        }

        if (forum.isPasswordProtected() && forum.getPassword() && forum.getPassword().length > 0) {
            // TODO: Implement password later on
        }
    }

    /**
     * Handles redirection forums.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The reponse object from Express.
     * @param {number} forumId - The forum identifier.
     */
    static async handleRedirectForum(req, res, forumId) {
        const member = req.member;
        const forum = ForumRepository.getForumById(forumId);

        if (!forum) {
            throw new Error(LocaleHelper.get('errors', 'forumDoesNotExistForRedirect'));
        }

        let redirect = forum.getRedirect();

        if (redirect && redirect.enabled) {
            const cache = CacheProviderFactory.create();
            const db = DatabaseProviderFactory.create();
            const builder = new QueryBuilder();

            if (redirect.uniqueClicks) {
                if (member.isSignedIn()) {
                    const alreadyClicked = cache.get('forum_clicks').find(click => click.memberId === member.getId() && click.forumId === parseInt(forumId, 10));

                    if (!alreadyClicked) {
                        await this.updateRedirectClicks(forumId, redirect);

                        await db.query(builder
                            .clear()
                            .insertInto('forum_clicks', [
                                'memberId', 'forumId', 'clickedAt'
                            ], [
                                member.getId(), parseInt(forumId, 10), DateTimeHelper.dateToEpoch(new Date())
                            ])
                            .build()
                        );

                        await cache.update('forum_clicks');
                    }
                } else {
                    if (CookieHelper.exists(req, CookieList.REDIRECT_TRACKER)) {
                        let redirectData = JSON.parse(CookieHelper.get(req, CookieList.REDIRECT_TRACKER));
                        const alreadyClicked = redirectData.find(click => click === parseInt(forumId, 10));

                        if (!alreadyClicked) {
                            await this.updateRedirectClicks(forumId, redirect);
                            redirectData.push(forumId);
                            CookieHelper.set(res, CookieList.REDIRECT_TRACKER, JSON.stringify(redirectData));
                        }
                    } else {
                        await this.updateRedirectClicks(forumId, redirect);
                        CookieHelper.set(res, CookieList.REDIRECT_TRACKER, JSON.stringify([forumId]));
                    }
                }
            } else {
                await this.updateRedirectClicks(forumId, redirect);
            }

            res.redirect(redirect.url);
        }
    }

    /**
     * Updates the click data for a given redirect forum.
     * 
     * @param {number} forumId - The identifier of the forum that was clicked.
     * @param {Object} redirect - The redirection object.
     */
    static async updateRedirectClicks(forumId, redirect) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        redirect.totalClicks++;
        redirect.lastClick = DateTimeHelper.dateToEpoch(new Date());

        await db.query(builder
            .clear()
            .update('forums')
            .set(['redirect',], [JSON.stringify(redirect)])
            .where('id = ?', [forumId])
            .build()
        );

        await cache.update('forums');
    }

    /**
     * Get the total posts in a given forum.
     * 
     * @param {number} forumId - The forum indentifier.
     * @returns {number} The total posts in the given forum.
     */
    static getTotalPostsInForum(forumId) {
        const cache = CacheProviderFactory.create();
        const data = cache.get('posts').filter(post => post.forumId === forumId);
        return data.length;
    }

    /**
     * Get the total posters in a given forum.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {number} The total posters in the given forum.
     */
    static getTotalPostersInForum(forumId) {
        const cache = CacheProviderFactory.create();
        const data = cache.get('posts').filter(post => post.forumId === forumId);
        const currentPosters = [];

        data.forEach(post => {
            if (!currentPosters.includes(post.createdBy)) {
                currentPosters.push(post.createdBy);
            }
        });

        return currentPosters.length;
    }

    /**
     * Get the total views in the given forum.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {number} The total views in the given forum.
     */
    static getTotalViewsInForum(forumId) { 
        const cache = CacheProviderFactory.create();
        const data = cache.get('topics').filter(topic => topic.forumId === forumId);
        let total = 0;

        data.forEach(topic => {
            total += parseInt(topic.totalViews, 10);
        });

        return total;
    }

    /**
     * Get the total topics in the given forum.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {number} The total topics in the given forum.
     */
    static getTotalTopicsInForum(forumId) {
        const cache = CacheProviderFactory.create();
        return cache.get('topics').filter(topic => topic.forumId === forumId).length;
        
    }

    /**
     * Check whether the given forum has sub forums.
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {boolean} True if the forum has sub forums, false if not. 
     */
    static hasSubForums(forumId) {
        const cache = CacheProviderFactory.create();
        return cache.get('forums')
            .find(forum =>
                forum.hasParent === 1
                && forum.parentId === parseInt(forumId, 10)
                && forum.visible === 1) ? true : false;
    }

    /**
     * Build the sub forum components (link and the drop down menu).
     * 
     * @param {number} forumId - The forum identifier.
     * @returns {Object|null} An object containing the components or null if there are no sub forums (or they are hidden).
     */
    static buildSubForumsComponents(forumId) {
        if (!this.hasSubForums(forumId)) return null;
        const components = { link: null, menu: null };

        components.link = OutputHelper.getPartial('forumsHelper', 'sub-forums-link', { id: forumId });

        const cache = CacheProviderFactory.create();
        const subForums = cache.get('forums')
            .filter(forum =>
                forum.hasParent === 1
                && forum.parentId === parseInt(forumId, 10)
                && forum.visible === 1
                && forum.showSubForums === 1)
            .map(forum => ForumRepository.getForumById(forum.id));

        if (subForums && Array.isArray(subForums) && subForums.length > 0) {
            let menu = [];

            subForums.forEach(forum => {
                menu.push({
                    title: forum.getTitle(),
                    url: forum.url(),
                });
            });

            components.menu = OutputHelper.getPartial('forumsHelper', 'sub-forums-menu', {
                menu,
                id: forumId,
            });
        }

        return components;
    }

    /**
     * Get the total number of people browsing the given forum.
     * 
     * @param {number} forumId - The forum identifier.
     * @param {Object} [options={}] - Options for getting the total.
     * @param {boolean} [options.includeTopics=true] - True to include topics inside the forum, false not to. 
     * @returns {number} The total browsing the given forum.
     */
    static getTotalBrowsingForum(forumId, options = {}) {
        const { includeTopics = true } = options;
        const forum = ForumRepository.getForumById(forumId);
        if (!forum) return 0;
        const totalBrowsingForum = WhosOnlineHelper.getTotalBrowsingContent('forum', forum.getId());
        let totalFromTopics = 0;

        if (includeTopics) {
            const cache = CacheProviderFactory.create();
            const topics = cache.get('topics').filter(topic => topic.forumId === forum.getId());

            if (topics && topics.length > 0) {
                topics.forEach(topic => {
                    totalFromTopics += WhosOnlineHelper.getTotalBrowsingContent('topic', topic.id);
                });
            }

            return totalBrowsingForum + totalFromTopics;
        }

        return totalBrowsingForum;
    }
}

module.exports = ForumsHelper;