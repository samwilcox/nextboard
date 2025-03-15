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
const GroupRepository = require('../repository/groupRepository');
const path = require('path');
const DateTimeHelper = require('../helpers/dateTimeHelper');

/**
 * MemberRepository is responsible for handling and retrieval and construction of 'Member' entity.
 */
class MemberRepository {
    /**
     * Fetch a members's raw data by ID from the cache.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {Object[]|null} The resulting data object or null if data is not found.
     */
    static loadMemberDataById(memberId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.get('members').find(member => member.id === memberId);
        return data || null;
    }

    /**
     * Build a 'Member' entity from raw data.
     * 
     * @param {Object} data - The raw member data. 
     * @param {number} memberId - The member identifier.
     * @returns {Member|null} The constructed 'Member' entity or null if data is invalid.
     */
    static buildMemberFromData(data, memberId) {
        const Member = require('../entities/member');
        let member = new Member();

        const exists = data && Object.keys(data).length > 0;

        if (exists) {
            member.setId(data ? data.id : memberId);
            member.setUsername(data.username);
            member.setDisplayName(data.displayName);
            member.setPassword(data.passwordHash);
            member.setEmailAddress(data.emailAddress);
            member.setLocaleId(parseInt(data.localeId, 10));
            member.setThemeId(parseInt(data.themeId, 10));
            member.setUseDisplayName(Settings.get('useDisplayName') ? (parseInt(data.useDisplayName, 10) === 1) : false);
            member.setDateTime(data && data.dateTime ? JSON.parse(data.dateTime) : null);
            member.setPrimaryGroup(data && data.primaryGroupId ? GroupRepository.getGroupById(parseInt(data.primaryGroupId, 10)) : null);
            
            if (data && data.secondaryGroups && data.secondaryGroups.length > 0) {
                let groups = [];
                const secondaryGroups = JSON.parse(data.secondaryGroups);

                secondaryGroups.forEach(group => {
                    groups.push(GroupRepository.getGroupById(group));
                });

                member.setSecondaryGroups(groups);
            } else {
                member.setSecondaryGroups(null);
            }

            member.setWidgets(data && data.widgets ? JSON.parse(data.widgets) : null);
            member.setPhotoType(data.photoType ? data.photoType : null);
            member.setPhotoId(data.photoId ? parseInt(data.photoId, 10) : null);
            member.setPerPage(data.perPage ? JSON.parse(data.perPage) : null);
            member.setLockout(data.lockout ? JSON.parse(data.lockout) : null);
            member.setDisplayOnWo(parseInt(data.dislayOnWo, 10) === 1);
            member.setLastOnline(data.lastOnline ? DateTimeHelper.epochToDate(parseInt(data.lastOnline), 10) : null);
            member.setDefaultCalendarId(parseInt(data.defaultCalendarId, 10));
            member.setBirthday(data.birthday ? JSON.parse(data.birthday) : null);
            member.setDisplayOnWo(parseInt(data.displayOnWo, 10) === 1);
            member.setCoverPhotoType(data.coverPhotoType ? data.coverPhotoType : null);
            member.setCoverPhotoId(data.coverPhotoId ? parseInt(data.coverPhotoId, 10) : null);
            member.setCoverPhotoLink(data.coverPhotoLink ? data.coverPhotoLink : null);
            member.setJoined(data.joined ? DateTimeHelper.epochToDate(parseInt(data.joined, 10)) : null);
            member.setTotalPosts(data.totalPosts ? parseInt(data.totalPosts, 10) : 0);
            member.setReputation(data.reputation ? parseInt(data.reputation, 10) : 0);
            member.setFollowers(data.followers ? JSON.parse(data.followers) : {});
            member.setLocation(data.location ? data.location : null);
            member.setGender(data.gender ? data.gender : null);
            member.setToggles(data.toggles ? JSON.parse(data.toggles) : null);
            member.setPronouns(data.pronouns ? JSON.parse(data.pronouns) : null);
            member.setPronunciation(data.pronunciation ? data.pronunciation : null);
            member.setWebsiteUrl(data.websiteUrl ? data.websiteUrl : null);
            member.setEditorConfigs(data.editorConfigs ? JSON.parse(data.editorConfigs) : Settings.get('editorConfigs'));
            member.setCensor(data.censor ? parseInt(data.censor, 10) : false);
            member.setCensorChar(data.censorChar);
            member.setSignature(data.signature ? data.signature : null);
            member.setBBIC(data.bbic ? JSON.parse(data.bbic) : null);
        } else {
            member = this.populateGuestSettings(member);
        }

        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();

        data = cache.getAll({
            locales: 'locales',
            themes: 'themes',
        });

        const locale = data.locales.find(locale => locale.id === member.getLocaleId());
        const theme = data.themes.find(theme => theme.id === member.getThemeId());
        const imagesetFolder = theme.imagesetFolder;

        const configs = {
            localePath: path.join(__dirname, '..', '..', 'locale', locale.folder),
            themePath: path.join(__dirname, '..', '..', 'themes', theme.folder),
            themeCssUrl: `${process.env.BASE_URL}/css/${theme.folder}`,
            imagesetUrl: `${process.env.BASE_URL}/imagesets/${imagesetFolder}`,
            themeFolder: theme.folder,
        };

        member.setConfigs(configs);

        return member;
    }

    /**
     * Get the 'Member' entity by ID.
     * 
     * @param {number} memberId - The member identifier.
     * @returns {Member|null} The 'Member' entity or null if not found.
     */
    static getMemberById(memberId) {
        const data = this.loadMemberDataById(memberId);
        return this.buildMemberFromData(data, memberId);
    }

    /**
     * Populates the member entity properties with guest values.
     * 
     * @param {Member} member - The member entity instance.
     * @returns {Member} The member entity populated with guest settings.
     */
    static populateGuestSettings(member) {
        member.setId(0);
        member.setUsername('Guest');
        member.setDisplayName('Guest');
        member.setPassword(null);
        member.setEmailAddress(null);
        member.setLocaleId(Settings.get('defaultLocaleId'));
        member.setThemeId(Settings.get('defaultThemeId'));
        member.setUseDisplayName(false);
        member.setDateTime(Settings.get('defaultDateTime'));
        member.setPrimaryGroup(GroupRepository.getGroupById(Settings.get('guestGroupId')));
        member.setSecondaryGroups(null);
        member.setWidgets(Settings.get('defaultWidgets'));
        member.setPhotoType(null);
        member.setPhotoId(null);
        member.setPerPage(Settings.get('defaultPerPage'));
        member.setLockout(null);
        member.setDisplayOnWo(false);
        member.setDefaultCalendarId(Settings.get('defaultCalendarId'));
        member.setBirthday(null);
        member.setDisplayOnWo(false);
        member.setJoined(null);
        member.setTotalPosts(0);
        member.setFollowers(null);
        member.setLocation(null);
        member.setGender(null);
        member.setToggles(Settings.get('defaultToggles'));
        member.setPronouns(null);
        member.setPronunciation(null);
        member.setWebsiteUrl(null);
        member.setEditorConfigs(Settings.get('editorConfigs'));
        member.setCensor(Settings.get('defaultCensor'));
        member.setCensorChar(Settings.get('defaultCensorChar'));
        member.setSignature(null);
        member.setBBIC(Settings.get('defaultBBIC'));

        return member;
    }
}

module.exports = MemberRepository;