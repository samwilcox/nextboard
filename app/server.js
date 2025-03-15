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

const express = require('express');
const app = express();
const initializeDatabase = require('./services/databaseService');
const initializeCache = require('./services/cacheService');
const initializeSettings = require('./services/settingsService');
const initializeRoutes = require('./services/routesService');
const initializeMiddleware = require('./middleware/indexMiddleware');
//const PluginService = require('./services/pluginService');
const startServer = require('./services/serverService');
const Settings = require('./settings');

/**
 * Initializes the NextBoard application.
 */
module.exports = () => {
    initializeDatabase()
        .then(() => initializeCache())
        .then(() => {
            initializeSettings();
            //PluginService.loadPlugins();
            initializeMiddleware(app);
            initializeRoutes(app);
            startServer(app);
        })
        .catch(error => {
            console.error(`Error initializing NextBoard: ${error}`);
            process.exit(1);
        });
};