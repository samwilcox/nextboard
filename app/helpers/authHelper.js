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
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const QueryBuilder = require('../data/db/queryBuilder');
const DataStoreService = require('../services/dataStoreService');
const MemberRepository = require('../repository/memberRepository');
const MemberService = require('../services/memberService');
const Settings = require('../settings');
const DateTimeHelper = require('./dateTimeHelper');
const LocaleHelper = require('./localeHelper');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const CookieHelper = require('./cookieHelper');
const CookieList = require('../lists/CookieList');
const MemberDeviceRepository = require('../repository/memberDeviceRepository');
const UtilHelper = require('./utilHelper');
const SessionHelper = require('./sessionHelper');
const SessionList = require('../lists/SessionList');
const util = require('util');

/**
 * Helpers for authentication-related tasks.
 */
class AuthHelper {
    /**
     * Validate a given user's credentials.
     * 
     * @param {string} identity - The account identity (e.g., 'johnsmith' or 'jsmith@example.com').
     * @param {string} password - The password that was entered by the user.
     * @returns {Object} An object containing the results and data.
     */
    static validateCredentials(identity, password) {
        const member = MemberService.getMemberByIdentity(identity);

        if (!member) {
            return {
                success: false,
                data: {
                    reason: 'signInFailed',
                    message: LocaleHelper.get('errors', 'userCredentialsInvalid'),
                    attempts: 0,
                    expires: null,
                    member: MemberService.getMemberById(0),
                } 
            };
        }
        
        if (!this.verifyPassword(password, member.getPassword())) {
            const lockedInfo = this.handleAccountLockout(member.getEmailAddress(), false);

            if (lockedInfo.locked) {
                return {
                    success: false,
                    data: {
                        reason: 'lockedOut',
                        message: lockedInfo.expires === null
                            ? LocaleHelper.get('errors', 'lockedOutExpiredDisabled')
                            : LocaleHelper.replace('errors', 'lockedOutExpiredEnabled', 'total', Math.round(lockedInfo.expires)),
                        attempts: lockedInfo.attempts,
                        expires: lockedInfo.expires,
                        member: member,
                    }
                };
            } else {
                if (lockedInfo.enabled) {
                    return {
                        success: false,
                        data: {
                            reason: 'signInFailed',
                            message: LocaleHelper.replaceAll('errors', 'signInFailedWithAttemptsRemaining', {
                                start: lockedInfo.attempts,
                                end: maxAttempts,
                            }),
                            attempts: lockedInfo.attempts,
                            expires: lockedInfo.expires,
                            member: member,
                        }
                    };
                } else {
                    return {
                        success: false,
                        data: {
                            reason: 'signInFailed',
                            message: LocaleHelper.get('errors', 'userCredentialsInvalid'),
                            attempts: 0,
                            expires: null,
                            member: member,
                        }
                    };
                }
            }
        }

        const lockedInfo = this.handleAccountLockout(member.getEmailAddress(), true);

        if (lockedInfo.locked) {
            return {
                success: false,
                data: {
                    reason: 'lockedOut',
                    message: lockedInfo.expires === null
                        ? LocaleHelper.get('errors', 'lockedOutExpiredDisabled')
                        : LocaleHelper.replace('errors', 'lockedOutExiredEnabled', 'total', Math.round(lockedInfo.expires)),
                    attempts: 0,
                    member: member,
                }
            };
        } else {
            return {
                success: true,
                data: {
                    reason: null,
                    message: null,
                    attempts: 0,
                    member: member,
                }
            };
        }
    }

    /**
     * Handle the account lockout policy.
     * 
     * @param {string} email - The account email address.
     * @param {boolean} auth - True if authenticated, false if not. 
     */
    static async handleAccountLockout(email, auth) {
        if (Settings.get('accountLockoutEnabled')) {
            const cache = CacheProviderFactory.create();
            const db = DatabaseProviderFactory.create();
            const builder = new QueryBuilder();
            const account = cache.get('members').find(member => member.email === email);
            const exists = account ? true : false;

            if (!exists) return false;

            const member = MemberRepository.getMemberById(account.id);
            let lockout = member.getLockout();
            const maxAttempts = Settings.get('accountLockoutMaxFailedAttempts');
            const allowExpire = Settings.get('accountLockoutAllowExpire');
            const lockoutExpirationMins = Settings.get('accountLockoutExpirationMinutes');

            if (auth) {
                if (lockout.locked && lockout.attempts < maxAttempts) {
                    lockout = {
                        locked: false,
                        attempts: 0,
                        expires: null,
                    };

                    await db.query(builder
                        .clear()
                        .update('members')
                        .set(['lockout'], [JSON.stringify(lockout)])
                        .where('id = ?', [member.getId()])
                        .build()
                    );

                    await cache.update('members');

                    return {
                        lockout: false,
                        attempts: 0,
                        expires: null,
                    };
                }

                if (lockout.locked && allowExpire && lockout.expires <= DateTimeHelper.dateToEpoch(new Date())) {
                    lockout.attempts = 0;
                    lockout.locked = false;
                    lockout.expires = null;

                    await db.query(builder
                        .clear()
                        .update('members')
                        .set(['lockout'], [JSON.stringify(lockout)])
                        .where('id = ?', [member.getId()])
                        .build()
                    );

                    await cache.update('members');

                    return {
                        lockout: false,
                        attempts: 0,
                        expires: null,
                    };
                }
            } else {
                let attempts = lockout.attempts;
                attempts++;

                if (attempts >= maxAttempts) {
                    lockout.attempts = attempts;
                    lockout.locked = true;

                    if (allowExpire) {
                        lockout.expires = DateTimeHelper.dateToEpoch(new Date()) + (lockoutExpirationMins * 60);
                    } else {
                        lockout.expires = null;
                    }

                    await db.query(builder
                        .clear()
                        .update('members')
                        .set(['lockout'], [JSON.stringify(lockout)])
                        .where('id = ?', [member.getId()])
                        .build()
                    );

                    await cache.update('members');

                    return {
                        locked: false,
                        enabled: true,
                        attempts: attempts,
                        expires: lockout.expires,
                    };
                }
            }
        }

        return {
            locked: false,
            enabled: false,
            attempts: 0,
            expires: null,
        };
    }

    /**
     * Hash a password.
     * 
     * @param {string} password - The password to hash.
     * @param {number} [saltRounds=10] - The number of salt rounds (default is 10).
     * @returns {string} The hashed string.
     */
    static hashPassword(password, saltRounds = 10) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    }

    /**
     * Verify a given password.
     * 
     * @param {string} enteredPassword - The entered password by the user.
     * @param {string} storedHashedPassword - The hashed password from the database.
     * @returns {boolean} True if verified, false if unverified.
     */
    static verifyPassword(enteredPassword, storedHashedPassword) {
        return bcrypt.compareSync(enteredPassword, storedHashedPassword);
    }

    /**
     * Generate a new authentication token.
     * 
     * @param {Member} member - The member entity object.
     * @returns {string} Authentication token string. 
     */
    static generateAuthToken(member) {
        const data = `${member.getId()}${member.getEmailAddress()}${Date.now()}`;
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
    }

    /**
     * Generate a new hash for the device.
     * 
     * @returns {string} The device hash string.
     */
    static generateDeviceHash() {
        const data = DataStoreService.get('request').headers['user-agent'] + Date.now();
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
    }

    /**
     * Complete the user sign in process.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @param {Member} member - The member entity object. 
     * @param {Object} [params={}] - Optional parameters. 
     * @param {boolean} [params.rememberMe=false] - True to remember the user, false not to.
     * @param {number} [params.expiration] - The expiration of the session.
     * @param {string} [params.url] - The URL web address to redirect to after sign in completes.
     */
    static async completeSignIn(req, res, member, params = {}) {
        if (res.headersSent) return;

        const {
            rememberMe = false,
            expriration = Settings.get('sessionDurationMinutes'),
            url = UtilHelper.buildUrl()
        } = params;

        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        const token = this.generateAuthToken(member);
        let deviceId;
        let device;
        
        if (CookieHelper.exists(CookieList.DEVICE_ID)) {
            deviceId = CookieHelper.get(req, CookieList.DEVICE_ID);
            device = MemberDeviceRepository.getMemberDeviceById(deviceId);
        } else {
            deviceId = null;
            device = null;
        }
        
        if (device) {
            await db.query(builder
                .clear()
                .update('member_devices')
                .set([
                    'token', 'userAgent', 'lastUsedAt'
                ], [
                    token,
                    req.headers['user-agent'],
                    DateTimeHelper.dateToEpoch(new Date()),
                ])
                .where('id = ?', [deviceId])
                .build()
            );

            await cache.update('member_devices');
        } else {
            const deviceHash = this.generateDeviceHash();

                await db.query(builder
                    .clear()
                    .insertInto('member_devices', [
                        'id', 'memberId', 'token', 'userAgent', 'lastUsedAt'
                    ], [
                        deviceHash, member.getId(), token, req.headers['user-agent'], DateTimeHelper.dateToEpoch(new Date())
                    ])
                    .build()
                );

                await cache.update('member_devices');

                CookieHelper.set(res, CookieList.DEVICE_ID, deviceHash, DateTimeHelper.stringToDate('+10 years'));
        }

        const _expiration = rememberMe ? DateTimeHelper.stringToDate(Settings.get('rememberMeCookieExpiration')) : (DateTimeHelper.dateToEpoch(new Date()) + (Settings.get('sessionDurationMinutes') * 60));
        CookieHelper.set(res, CookieList.AUTH_TOKEN, token, _expiration);
        SessionHelper.set(req, SessionList.AUTH_TOKEN, token);
        const lockout = member.getLockout();

        if (lockout && lockout.attempts !== 0 && !lockout.locked) {
            await db.query(builder
                .clear()
                .update('members')
                .set(['lockout'], JSON.stringify(lockout))
                .where('id = ?', [member.getid()])
                .build()
            );

            await cache.update('members');
        }

        const session = cache.get('sessions').find(session => session.memberId === member.getId());
        const sessionExists = session ? true : false;
        let sessionId;

        if (sessionExists) {
            sessionId = session.id;

            await db.query(builder
                .clear()
                .update('sessions')
                .set(['memberId'], [member.getId()])
                .where('id = ?', [sessionId])
                .build()
            );

            await cache.update('sessions');
        }

        await db.query(builder
            .clear()
            .update('sessions')
            .set([
                'memberId', 'displayOnWo'
            ], [
                member.getId(), member.getDisplayOnWo() ? 1 : 0
            ])
            .where('id = ?', [req._session.getId()])
            .build()
        );

        await cache.update('sessions');
        res.redirect(url);
    }

    /**
     * Sign out the member from their account.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} res - The response object from Express.
     * @throws {Error} Throws an error if the session fails to be destroyed.
     */
    static async signOut(req, res) {
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        if (CookieHelper.exists(req, CookieList.AUTH_TOKEN)) {
            const deviceData = cache.get('member_devices').find(device => device.token === CookieHelper.get(req, CookieList.AUTH_TOKEN));

            if (deviceData) {
                await db.query(builder
                    .clear()
                    .update('member_devices')
                    .set([
                        'token', 'lastUsedAt'
                    ], [
                        null, DateTimeHelper.dateToEpoch(new Date())
                    ])
                    .where('id = ?', [deviceData.id])
                    .build()
                );

                await cache.update('member_devices');
            }

            CookieHelper.delete(res, CookieList.AUTH_TOKEN);
        }

        await db.query(builder
            .clear()
            .update('members')
            .set(['lastOnline'], [DateTimeHelper.dateToEpoch(new Date())])
            .where('id = ?', [req.member.getId()])
            .build()
        );

        await db.query(builder
            .clear()
            .deleteFrom('sessions')
            .where('id = ?', [MemberService.getSession().getId()])
            .build()
        );

        await cache.updateAll(['members', 'sessions']);

        try {
            const destroySession = util.promisify(req.session.destroy).bind(req.session);
            await destroySession();
            res.clearCookie('connect.sid', { path: '/' });
            SessionHelper.delete(req, SessionList.AUTH_TOKEN);
            res.redirect(UtilHelper.getReferer(req));
        } catch (error) {
            console.error('Error destroying session:', error);
            throw new Error(LocaleHelper.replace('errors', 'cannotDestroySession', 'error', error));
        }
    }
}

module.exports = AuthHelper;