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
const DateTimeHelper = require('../helpers/dateTimeHelper');
const RegistryService = require('../services/registryService');

/**
 * Middleware for executing tasks when needed.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const tasksMiddleware = async (req, res, next) => {
    try {
        // Check the "most users online ever" value and update if needed
        const cache = CacheProviderFactory.create();
        const totalSessions = cache.get('sessions').length;

        if (RegistryService.exists('mostUsers')) {
            let mostUsers = RegistryService.get('mostUsers');

            if (totalSessions > mostUsers.total) {
                mostUsers.total = totalSessions;
                mostUsers.timestamp = DateTimeHelper.dateToEpoch(new Date());
                await RegistryService.set('mostUsers', mostUsers, 'serialized');
            }
        } else {
            let mostUsers = {};
            mostUsers.total = totalSessions;
            mostUsers.timestamp = DateTimeHelper.dateToEpoch(new Date());
            await RegistryService.set('mostUsers', mostUsers, 'serialized');
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = tasksMiddleware;