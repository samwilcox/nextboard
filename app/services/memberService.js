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

/**
 * MemberService that provides services for working with members.
 */
class MemberService {
    static instance = null;
    static member = null;
    static session = null;

    /**
     * Get the singleton instance of MemberService.
     * 
     * @returns {MemberService} The singleton instance of MemberService.
     */
    static getInstance() {
        if (!MemberService.instance) {
            MemberService.instance = new MemberService();
        }

        return MemberService.instance;
    }

    /**
     * Get the current member entity instance.
     * 
     * @returns {Member} The current member entity instance.
     */
    getMember() {
        return this.member;
    }

    /**
     * Set the current member entity instance.
     * 
     * @param {Member} member - The current member entity instance.
     */
    setMember(member) {
        this.member = member;
    }

    /**
     * Get the configs for the current member.
     * 
     * @returns {Object} The member configs.
     */
    getConfigs() {
        return this.member.getConfigs();
    }

    /**
     * Get the session entity instance.
     * 
     * @returns {Session} The session entity instance.
     */
    getSession() {
        return this.session;
    }

    /**
     * Set the session entity instance.
     * 
     * @param {Session} session - The session entity instance. 
     */
    setSession(session) {
        this.session = session;
    }

    /**
     * Get a Member entity by ID.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {Member|null} The resulting Member entity or null if not found. 
     */
    getMemberById(memberId) {
        return MemberRepository.getMemberById(memberId);
    }

    /**
     * Get a Member entity by identity.
     * 
     * @param {string} identity - The member's identity.
     * @returns {Member|null} The resulting Member entity or null if not found.
     */
    getMemberByIdentity(identity) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('members').find(member => member.username === identity || member.emailAddress === identity);
        return !data ? null : this.getMemberById(data.id);
    }

    /**
     * Check if a member exists.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {boolean} True if exists, false if not.
     */
    doesMemberExistById(memberId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        return cache.get('members').find(member => member.id === parseInt(memberId, 10)) ? true : false;
    }

    /**
     * Get the total number of answers to questions for this given member.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {number} The total number of answers the given member has given.
     */
    getTotalAnswers(memberId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('topics')
            .filter(topic => 
                topic.answered === 1 &&
                topic.answeredData ?
                topic.answeredData.answeredBy === parseInt(memberId, 10) :
                null
        );

        return data.length;
    }
}

module.exports = MemberService.getInstance();