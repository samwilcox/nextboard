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
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const ejsLayouts = require('express-ejs-layouts');
const localeMiddleware = require('./localeMiddleware');
const viewEngineMiddleware = require('./viewEngineMiddleware');
const sessionMiddleware = require('./sessionMiddleware');
const { secureStateMiddleware } = require('securestate');
const memberMiddleware = require('./memberMiddleware');
const tasksMiddleware = require('./tasksMiddleware');
const adminMiddleware = require('./adminMiddleware');

/**
 * Sets up all the middleware for NextBoard.
 * 
 * @param {Express} app - The express application object instance. 
 */
module.exports = (app) => {
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(secureStateMiddleware);
    app.use(session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.SESSION_SECURE_COOKIE === 'true',
            maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE_SECONDS, 10),
        },
    }));
    app.use(memberMiddleware);
    app.use(sessionMiddleware);
    app.use(localeMiddleware(app));
    app.use(viewEngineMiddleware);
    app.use(tasksMiddleware);
    app.use(ejsLayouts);
    app.use(adminMiddleware);

    console.log('NextBoard middleware has been setup.');
};