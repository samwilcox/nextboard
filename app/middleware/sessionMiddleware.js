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

const SessionRepository = require('../repository/sessionRepository');
const MemberRepository = require('../repository/memberRepository');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const CookieHelper = require('../helpers/cookieHelper');
const Settings = require('../settings');
const UtilHelper = require('../helpers/utilHelper');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DateTimeHelper = require('../helpers/dateTimeHelper');
const MemberService = require('../services/memberService');
const CookieList = require('../lists/CookieList');

/**
 * Middleware for managing user sessions.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const sessionMiddleware = async (req, res, next) => {
    try {
        await garbageCollection();
        const cache = CacheProviderFactory.create();
        const session = SessionRepository.getSessionById(req.sessionID);

        if (CookieHelper.exists(req, CookieList.AUTH_TOKEN)) {
            const token = CookieHelper.get(req, CookieList.AUTH_TOKEN);
            const data = cache.getAll({
                devices: 'member_devices',
                members: 'members',
                sessions: 'sessions',
            });

            const deviceData = data.devices.find(device => device.token === token);
            const exists = deviceData ? true : false;

            if (exists) {
                const member = data.members.find(member => member.id === parseInt(deviceData.memberId, 10));
                const sessionData = data.sessions.find(session => session.memberId == member.id);
                const sessionExists = sessionData ? true : false;

                if (sessionExists) {
                    session.setIpAddress(sessionData.ipAddress);
                    session.setUserAgent(sessionData.userAgent);
                    session.setHostname(sessionData.hostname);
                    session.setIsAdmin(parseInt(sessionData.isAdmin, 10) === 1);

                    if (Settings.get('ipMatch')) {
                        if (session.getIpAddress() !== UtilHelper.getUserIp(req) || session.getUserAgent() !== req.headers['user-agent']) {
                            destroy(req);
                            res.redirect(process.env.BASE_URL);
                        } else {
                            session.setMemberId(member.id);
                            session.setDisplayOnWo(member.displayOnWo);
                            req._session = session;
                            MemberService.setSession(session);
                            update(req, true);
                        }
                    } else {
                        session.setMemberId(member.id);
                        session.setDisplayOnWo(member.displayOnWo);
                        req._session = session;
                        MemberService.setSession(session);
                        update(req, true);
                    }
                } else {
                    session.setMemberId(member.id);
                    session.setDisplayOnWo(member.displayOnWo);
                    req._session = session;
                    MemberService.setSession(session);
                    create(req, true);
                }
            } else {
                req.member = MemberRepository.getMemberById(0);
                destroy(req);
                res.redirect(process.env.BASE_URL);
            }
        } else {
            req.member = MemberRepository.getMemberById(0);
            const data = cache.get('sessions');
            let sessionData = data.find(session => session.id == req.sessionID);
            const sessionExists = sessionData && sessionData !== undefined;

            if (sessionExists) {
                if (Settings.get('ipMatch')) {
                    if (sessionData.ipAddress !== UtilHelper.getUserIp(req) || sessionData.userAgent !== req.headers['user-agent']) {
                        destroy(req);
                        res.redirect(process.env.BASE_URL);
                    } else {
                        session.setId(req.sessionID);
                        req._session = session;
                        MemberService.setSession(session);
                        update(req);
                    }
                } else {
                    session.setId(req.sessionID);
                    req._session = session;
                    MemberService.setSession(session);
                    update(req);
                }
            } else {
                session.setId(req.sessionID);
                req._session = session;
                MemberService.setSession(session);
                create(req);
            }
        }

        req._session = session;
        MemberService.setSession(session);

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new session in the database.
 * 
 * @param {Object} req - The request object from Express.
 * @param {boolean} [isMember=false] - True if a member, false if a guest (default is false).
 */
const create = async (req, isMember = false) => {
    if (!req.originalUrl.includes('/ajax')) {
        const db = DatabaseProviderFactory.create();
        const cache = CacheProviderFactory.create();
        const builder = new QueryBuilder();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + Settings.get('sessionDuration') * 60);

        req._session.setExpires(expiryDate);
        req._session.setLastClick(new Date());
        req._session.setLocation(req.originalUrl);
        req._session.setUserAgent(req.headers['user-agent']);
        req._session.setHostname(req.hostname);
        req._session.setIpAddress(UtilHelper.getUserIp(req));

        if (!isMember) {
            req._session.setMemberId(0);
            req._session.setIsAdmin(false);
            req._session.setDisplayOnWo(false);
        }

        if (isMember) {
            autoSignInMember(req);
        }

        const botData = UtilHelper.detectBots(req);
        req._session.setIsBot(botData.isBot);
        req._session.setBotName(botData.name);

        db.query(
            builder
                .clear()
                .insertInto('sessions', [
                    'id',
                    'memberId',
                    'expires',
                    'lastClick',
                    'location',
                    'ipAddress',
                    'hostname',
                    'userAgent',
                    'displayOnWo',
                    'isBot',
                    'botName',
                    'isAdmin'
                ], [
                    req._session.getId(),
                    req._session.getMemberId(),
                    DateTimeHelper.dateToEpoch(req._session.getExpires()),
                    DateTimeHelper.dateToEpoch(req._session.getLastClick()),
                    req._session.getLocation(),
                    req._session.getIpAddress(),
                    req._session.getHostname(),
                    req._session.getUserAgent(),
                    req._session.getDisplayOnWo() ? 1 : 0,
                    req._session.getIsBot() ? 1 : 0,
                    req._session.getBotName(),
                    req._session.getIsAdmin() ? 1 : 0,
                ])
                .build()
        )
        .then(result => {
            if (process.env.DEBUG === 'true') {
                console.log(`[DEBUG] Data inserted successfully: ${result}`);
            }
        })
        .catch(error => {
            console.error(`Error inserting data into database: ${error}`);
        });

        await cache.update('sessions');
    }
};

/**
 * Update an existing session in the database.
 * 
 * @param {Object} req - The request object from Express.
 * @param {boolean} [isMember=false] - True if a member, false if a guest (default is false).
 */
const update = async (req, isMember = false) => {
    if (!req.originalUrl.includes('/ajax')) {
        const db = DatabaseProviderFactory.create();
        const cache = CacheProviderFactory.create();
        const builder = new QueryBuilder();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + Settings.get('sessionDuration') * 60);
        
        req._session.setExpires(expiryDate);
        req._session.setLastClick(new Date());
        req._session.setLocation(req.originalUrl);
        req._session.setUserAgent(req.headers['user-agent']);
        req._session.setHostname(req.hostname);
        req._session.setIpAddress(UtilHelper.getUserIp(req));

        if (!isMember) {
            req._session.setMemberId(0);
            req._session.setDisplayOnWo(false);
            req._session.setIsAdmin(false);
        }

        if (isMember) {
            autoSignInMember(req);
        }

        const botData = UtilHelper.detectBots(req);
        req._session.setIsBot(botData.isBot);
        req._session.setBotName(botData.name);

        db.query(
            builder
                .clear()
                .update('sessions')
                .set([
                    'expires',
                    'lastClick',
                    'location',
                    'displayOnWo',
                ], [
                    DateTimeHelper.dateToEpoch(req._session.getExpires()),
                    DateTimeHelper.dateToEpoch(req._session.getLastClick()),
                    req._session.getLocation(),
                    req._session.getDisplayOnWo() ? 1 : 0,
                ])
                .where('id = ?', [req._session.getId()])
                .build()
        )
        .then(result => {
            if (process.env.DEBUG === 'true') {
                console.log(`[DEBUG] Data inserted successfully: ${result}`);
            }
        })
        .catch(error => {
            console.error(`Error inserting data into the database: ${error}`);
        });

        await cache.update('sessions');
    }
};

/**
 * Destroys the current session.
 * 
 * @param {Object} req - The request object from Express.
 */
const destroy = async (req) => {
    if (req.originalUrl.includes('/ajax')) {
        let sessionId = null;
        const db = DatabaseProviderFactory.create();
        const cache = CacheProviderFactory.create();
        const builder = new QueryBuilder();

        if (req._session === null || req._session === undefined) {
            sessionId = req.sessionID;
        } else {
            sessionId = req._session.getId();
        }

        req.session.destroy(error => {
            if (error) {
                console.error(`Failed to destroy the user session: ${error}`);
            }
        });

        CookieHelper.delete(CookieList.AUTH_TOKEN);

        db.query(
            builder
                .clear()
                .deleteFrom('sessions')
                .where('id = ?', [sessionId])
                .build()
        )
        .then(result => {
            if (process.env.DEBUG === 'true') {
                console.log(`[DEBUG] Data inserted successfully: ${result}`);
            }
        })
        .catch(error => {
            console.error(`Error inserting data into the database: ${error}`);
        });

        await cache.update('sessions');
    }
};

/**
 * Performs garbage collection on old expires sessions from the database.
 */
const garbageCollection = async () => {
    const db = DatabaseProviderFactory.create();
    const cache = CacheProviderFactory.create();
    const builder = new QueryBuilder();
    const data = cache.get('sessions').filter(session => session.expires <= DateTimeHelper.dateToEpoch(new Date()));

    if (data.length > 0) {
        data.forEach(session => {
            db.query(
                builder
                    .clear()
                    .deleteFrom('sessions')
                    .where('id = ?', [session.id])
                    .build()
            )
            .then(result => {
                if (process.env.DEBUG === 'true') {
                    console.log(`[DEBUG] Expired session garbage collection succeeded: ${result}.`);
                }
            })
            .catch(error => {
                if (process.env.DEBUG === 'true') {
                    console.warn(`[DEBUG] Failed to delete expired sessions from the database: ${error}.`);
                }
            });
        });
    }
};

/**
 * Auto signs in the member if a valid token exists.
 * 
 * @param {Object} req - The request object from Express.
 */
const autoSignInMember = (req) => {
    if (CookieHelper.exists(req, CookieList.AUTH_TOKEN)) {
        const cache = CacheProviderFactory.create();
        const device = cache.get('member_devices').find(device => device.token === CookieHelper.get(req, CookieList.AUTH_TOKEN));
        const exists = device ? true : false;
        
        if (exists) {
            req.member.setSignedIn(true);
        }
    }
};

module.exports = sessionMiddleware;