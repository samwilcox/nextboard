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

const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * MemberDeviceRepository is responsible for handling and retrieval and construction of 'MemberDevice' entity.
 */
class MemberDeviceRepository {
    /**
     * Fetch a member device's raw data by ID from the cache.
     * 
     * @param {number} memberDeviceId - The member device identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadMemberDeviceDataById(memberDeviceId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('member_devices').find(device => device.id === memberDeviceId);
        return data || null;
    }

    /**
     * Build a 'MemberDevice' entity from raw data.
     * 
     * @param {Object} data - The raw member device data. 
     * @param {number} memberDeviceId - The member device identifier.
     * @returns {MemberDevice|null} The constructed 'MemberDevice' entity or null if data is invalid.
     */
    static buildMemberDeviceFromData(data, memberDeviceId) {
        const MemberDevice = require('../entities/memberDevice');
        let memberDevice = new MemberDevice();

        if (!memberDevice) return null;
        
        memberDevice.setId(data ? data.id : memberDeviceId);
        memberDevice.setMemberId(parseInt(data.memberId, 10));
        memberDevice.setToken(data.token);
        memberDevice.setUserAgent(data.userAgent);
        memberDevice.setLastUsedAt(DateTimeHelper.epochToDate(parseInt(data.lastUsedAt, 10)));
        
        return memberDevice;
    }

    /**
     * Get the 'MemberDevice' entity by ID.
     * 
     * @param {number} memberDeviceId - The member device identifier.
     * @returns {MemberDevice|null} The 'MemberDevice' entity or null if not found.
     */
    static getMemberDeviceById(memberDeviceId) {
        const data = this.loadMemberDeviceDataById(memberDeviceId);
        return this.buildMemberDeviceFromData(data, memberDeviceId);
    }
}

module.exports = MemberDeviceRepository;