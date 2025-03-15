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

const Settings = require('../settings');
const indexRoutes = require('./indexRoutes');
const ajaxRoutes = require('./ajaxRoutes');
const forumRoutes = require('./forumRoutes');
const authRoutes = require('./authRoutes');
const calendarRoutes = require('./calendarRoutes');
const profileRoutes = require('./profileRoutes');
const topicRoutes = require('./topicRoutes');
const postRoutes = require('./postRoutes');
const downloadRoutes = require('./downloadRoutes');
const createRoutes = require('./createRoutes');

/**
 * Setup all the routes for NextBoard.
 * 
 * @param {Express} app - The Express object instance. 
 */
const setupRoutes = (app) => {
    app.use((req, res, next) => {
        req.settings = Settings.getAll();
        next();
    });

    app.use('/', indexRoutes);
    app.use('/ajax', ajaxRoutes);
    app.use('/forum', forumRoutes);
    app.use('/auth', authRoutes);
    app.use('/calendar', calendarRoutes);
    app.use('/profile', profileRoutes);
    app.use('/topic', topicRoutes);
    app.use('/post', postRoutes);
    app.use('/download', downloadRoutes);
    app.use('/create', createRoutes);
};

module.exports = setupRoutes;