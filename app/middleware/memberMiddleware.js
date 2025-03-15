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

const MemberRepository = require('../repository/memberRepository');
const MemberService = require('../services/memberService');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
const SessionHelper = require('../helpers/sessionHelper');
const SessionList = require('../lists/SessionList');

/**
 * Middleware for instantiating the member entity for the user.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const memberMiddleware = async (req, res, next) => {
    try {
        if (SessionHelper.exists(req, SessionList.AUTH_TOKEN)) {
            const cache = CacheProviderFactory.create();
            const data = cache.get('member_devices').find(device => device.token === SessionHelper.get(req, SessionList.AUTH_TOKEN));
            const exists = data ? true : false;
            let memberId = 0;
    
            if (exists) {
                memberId = data.memberId;
                req.member = MemberRepository.getMemberById(memberId);
                req.member.setSignedIn(true);
                MemberService.setMember(req.member);
            } else {
                req.member = MemberRepository.getMemberById(0);
                MemberRepository.setMember(req.member);
            }
        } else {
            req.member = MemberRepository.getMemberById(0);
            MemberService.setMember(req.member);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = memberMiddleware;