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
const LocaleHelper = require('../helpers/localeHelper');
const ProfileHelper = require('../helpers/profileHelper');
const UtilHelper = require('../helpers/utilHelper');
const MemberRepository = require('../repository/memberRepository');
const MemberService = require('../services/memberService');
const PermissionsService = require('../services/permissionsService');
const Features = require('../types/features');

/**
 * Model for displaying the member profiles.
 */
class ProfileModel {
    /**
     * Returns a new instance of ProfileModel.
     */
    constructor() {
        this.vars = {};
    }

    /**
     * Builds the member profile.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The resulting vars object instance.
     */
    async buildProfile(req) {
        const { memberId } = req.params;
        
        if (!MemberService.doesMemberExistById(memberId)) {
            throw new Error(LocaleHelper.replace('errors', 'memberDoesNotExist', 'id', memberId));
        }

        if (!PermissionsService.getFeaturePermission(Features.VIEW_PROFILE)) {
            throw new Error(LocaleHelper.get('errors', 'invalidViewProfilePermissions'));
        }
        
        const member = MemberRepository.getMemberById(parseInt(memberId, 10));
        
        this.vars.member = member;
        this.vars.profilePhoto = await member.profilePhoto();
        this.vars.lastOnline = DateTimeHelper.dateFormatter(member.getLastOnline(), { timeAgo: true, dateOnly: true });
        this.vars.joined = DateTimeHelper.dateFormatter(member.getJoined(), { timeAgo: true });
        this.vars.totalPosts = LocaleHelper.replace('profile', 'totalPosts', 'total', UtilHelper.formatNumber(member.getTotalPosts()));
        this.vars.reputation = LocaleHelper.replace('profile', 'reputation', 'total', UtilHelper.formatNumber(member.getReputation()));
        this.vars.totalFollowers = LocaleHelper.replace('profile', 'totalFollowers', 'total', UtilHelper.formatNumber(Object.keys(member.getFollowers()).length));
        this.vars.totalAnswers = LocaleHelper.replace('profile', 'totalAnswers', 'total', UtilHelper.formatNumber(MemberService.getTotalAnswers(member.getId())));
        this.vars.toggles = member.getToggles().display;
        this.vars.visitors = await ProfileHelper.getLimitedProfileVisitors(member.getId());
        this.vars.coverPhoto = await member.coverPhoto();

        await ProfileHelper.addNewProfileView(member.getId());

        this.vars.urls = {
            location: `https://www.google.com/maps?q=${encodeURIComponent(member.getLocation())}`,
        };

        return this.vars;
    }
}

module.exports = ProfileModel;