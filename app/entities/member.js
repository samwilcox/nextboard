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

const UtilHelper = require('../helpers/utilHelper');
const Settings = require('../settings');
const OutputHelper = require('../helpers/outputHelper');
const CacheProviderFactory = require('../data/cache/cacheProviderFactory');

/**
 * An entity that represents a single member.
 */
class Member {
    /**
     * Returns a new instance of Member.
     */
    constructor() {
        this.id = null;
        this.username = null;
        this.displayName = null;
        this.password = null;
        this.emailAddress = null;
        this.displayOnWo = false;
        this.localeId = null;
        this.themeId = null;
        this.dateTime = null;
        this.signedIn = false;
        this.configs = {};
        this.primaryGroup = null;
        this.secondaryGroups = null;
        this.useDisplayName = false;
        this.displayOnWo = false;
        this.widgets = {};
        this.photoType = null;
        this.photoId = null;
        this.perPage = {};
        this.lockout = {};
        this.lastOnline = null;
        this.defaultCalendarId = null;
        this.birthday = null;
        this.coverPhotoType = null;
        this.coverPhotoId = null;
        this.coverPhotoLink = null;
        this.joined = null;
        this.totalPosts = null;
        this.reputation = null;
        this.followers = {};
        this.location = null;
        this.gender = null;
        this.toggles = {};
        this.pronouns = null;
        this.pronunciation = null;
        this.websiteUrl = null;
        this.editorConfigs = {};
        this.censor = false;
        this.censorChar = '*';
        this.signature = null;
        this.bbic = {};
    }

    /**
     * Get the member identifier.
     * 
     * @returns {number} The member identifier.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the member identifier.
     * 
     * @param {number} id - The member identifier.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Get the username of the member.
     * 
     * @returns {string} The username of the member.
     */
    getUsername() {
        return this.username;
    }

    /**
     * Set the username of the member.
     * 
     * @param {string} username - The username of the member.
     */
    setUsername(username) {
        this.username = username;
    }

    /**
     * Get the display name of the member.
     * 
     * @returns {string} The display name of the member.
     */
    getDisplayName() {
        return this.displayName;
    }

    /**
     * Set the display name of the member.
     * 
     * @param {string} displayName - The display name of the member.
     */
    setDisplayName(displayName) {
        this.displayName = displayName;
    }

    /**
     * Get the member's password hash.
     * 
     * @returns {string} The member's password hash.
     */
    getPassword() {
        return this.password;
    }

    /**
     * Get the member's password hash.
     * 
     * @param {string} password - The member's password hash.
     */
    setPassword(password) {
        this.password = password;
    }

    /**
     * Get the email address of the member.
     * 
     * @returns {string} The email address of the member.
     */
    getEmailAddress() {
        return this.emailAddress;
    }

    /**
     * Set the email address of the member.
     * 
     * @param {string} emailAddress - The email address of the member.
     */
    setEmailAddress(emailAddress) {
        this.emailAddress = emailAddress;
    }

    /**
     * Get whether to display the member on the "Who's Online?" list.
     * 
     * @returns {boolean} True if the member wishes to be listed on the "Who's Online?" list, false not to.
     */
    getDisplayOnWo() {
        return this.displayOnWo;
    }

    /**
     * Set whether to display the member on the "Who's Online?" list.
     * 
     * @param {boolean} displayOnWo - True if the member wishes to be listed on the "Who's Online?" list, false not to.
     */
    setDisplayOnWo(displayOnWo) {
        this.displayOnWo = displayOnWo;
    }

    /**
     * Get the locale ID of the member.
     * 
     * @returns {string} The locale ID of the member.
     */
    getLocaleId() {
        return this.localeId;
    }

    /**
     * Set the locale ID of the member.
     * 
     * @param {string} localeId - The locale ID of the member.
     */
    setLocaleId(localeId) {
        this.localeId = localeId;
    }

    /**
     * Get the theme ID of the member.
     * 
     * @returns {string} The theme ID of the member.
     */
    getThemeId() {
        return this.themeId;
    }

    /**
     * Set the theme ID of the member.
     * 
     * @param {string} themeId - The theme ID of the member.
     */
    setThemeId(themeId) {
        this.themeId = themeId;
    }

    /**
     * Get the date/time settings.
     * 
     * @returns {Date} The date/time settings.
     */
    getDateTime() {
        return this.dateTime;
    }

    /**
     * Set the date/time settings.
     * 
     * @param {Date} dateTime - The date/time settings.
     */
    setDateTime(dateTime) {
        this.dateTime = dateTime;
    }

    /**
     * Get whether the member is signed in or not.
     * 
     * @returns {boolean} Whether the member is signed in.
     */
    isSignedIn() {
        return this.signedIn;
    }

    /**
     * Set the signed-in status of the member.
     * 
     * @param {boolean} signedIn - The signed-in status of the member.
     */
    setSignedIn(signedIn) {
        this.signedIn = signedIn;
    }

    /**
     * Get the configurations for the member.
     * 
     * @returns {Object} The member's configurations.
     */
    getConfigs() {
        return { ...this.configs };
    }

    /**
     * Set the configurations for the member.
     * 
     * @param {Object} configs - The configurations for the member.
     */
    setConfigs(configs) {
        this.configs = configs;
    }

    /**
     * Get the primary group of the member.
     * 
     * @returns {string} The primary group of the member.
     */
    getPrimaryGroup() {
        return this.primaryGroup;
    }

    /**
     * Set the primary group of the member.
     * 
     * @param {string} primaryGroup - The primary group of the member.
     */
    setPrimaryGroup(primaryGroup) {
        this.primaryGroup = primaryGroup;
    }

    /**
     * Get the secondary groups of the member.
     * 
     * @returns {Array} The secondary groups of the member.
     */
    getSecondaryGroups() {
        return this.secondaryGroups;
    }

    /**
     * Set the secondary groups of the member.
     * 
     * @param {Array} secondaryGroups - The secondary groups of the member.
     */
    setSecondaryGroups(secondaryGroups) {
        this.secondaryGroups = secondaryGroups;
    }

    /**
     * Get whether the member wants to use their display name.
     * 
     * @returns {boolean} True if to use the display name, false to use username.
     */
    getUseDisplayName() {
        return this.useDisplayName;
    }

    /**
     * Set whether the member wants to use their display name.
     * 
     * @param {boolean} useDisplayName - True if to use the display name, false to use username.
     */
    setUseDisplayName(useDisplayName) {
        this.useDisplayName = useDisplayName;
    }

    /**
     * Get whether the member is diplayed on the "Who's Online?" list.
     * 
     * @returns {boolean} True to display on the "Who's Online?" list, false to be anonymous.
     */
    getDisplayOnWo() {
        return this.displayOnWo;
    }

    /**
     * Set whether the member is displayed on the "Who's Online?" list.
     * 
     * @param {boolean} displayOnWo - True to display on the "Who's Online?" list, false to be anonymous
     */
    setDisplayOnWo(displayOnWo) {
        this.displayOnWo = displayOnWo;
    }

    /**
     * Get the member's widget settings.
     * 
     * @returns {Object} An object containing the widgets settings.
     */
    getWidgets() {
        return this.widgets;
    }

    /**
     * Set the member's widget settings.
     * 
     * @param {Object} widgets - An object containing the widgets settings.
     */
    setWidgets(widgets) {
        this.widgets = widgets;
    }

    /**
     * Get the member's photo type.
     * 
     * @returns {string} The photo type.
     */
    getPhotoType() {
        return this.photoType;
    }

    /**
     * Set the member's photo type.
     * 
     * @param {string} photoType - The photo type.
     */
    setPhotoType(photoType) {
        this.photoType = photoType;
    }

    /**
     * Get the member's photo identifier.
     * 
     * @returns {number} The photo identifier.
     */
    getPhotoId() {
        return this.photoId;
    }

    /**
     * Set the member's photo identifier.
     * 
     * @param {number} photoId - The photo identifier. 
     */
    setPhotoId(photoId) {
        this.photoId = photoId;
    }

    /**
     * Get the member's preferences for per page.
     * 
     * @returns {Object} Object containing the member's preferences for per page.
     */
    getPerPage() {
        return this.perPage;
    }

    /**
     * Set the member's preferences for per page.
     * 
     * @param {Object} perPage - Object containing the member's preferences for per page.
     */
    setPerPage(perPage) {
        this.perPage = perPage;
    }

    /**
     * Returns either the username or display name for the member depending on
     * the settings for display name.
     * 
     * @returns {string} The member's name (either username or display name dependent upon settings).
     */
    getName() {
        if (Settings.get('useDisplayName') && this.getUseDisplayName()) {
            return this.getDisplayName();
        } else {
            return this.getUsername();
        }
    }

    /**
     * Get the member's lockout settings object.
     * 
     * @returns {Object} An object containing the lockout settings.
     */
    getLockout() {
        return this.lockout;
    }

    /**
     * Set the member's lockout settings object.
     * 
     * @param {Object} lockout - An object containing the lockout settings.
     */
    setLockout(lockout) {
        this.lockout = lockout;
    }

    /**
     * Get the timestamp of when the member was last online.
     * 
     * @returns {number} The timestamp of when the member was last online.
     */
    getLastOnline() {
        return this.lastOnline;
    }

    /**
     * Set the timestamp of when the member was last online.
     * 
     * @param {number} lastOnline - The timestamp of when the member was last online.
     */
    setLastOnline(lastOnline) {
        this.lastOnline = lastOnline;
    }

    /**
     * Get the member's default calendar identifier.
     * 
     * @returns {number} The identifier of the member's default calendar.
     */
    getDefaultCalendarId() {
        return this.defaultCalendarId;
    }

    /**
     * Set the member's default calendar identifier.
     * 
     * @param {number} defaultCalendarId - The identifier of the member's default calendar.
     */
    setDefaultCalendarId(defaultCalendarId) {
        this.defaultCalendarId = defaultCalendarId;
    }

    /**
     * Get the member's birthday configuration object.
     * 
     * @returns {Object} An object containing the member's DOB and a flag indicating whether to display birthday and age.
     */
    getBirthday() {
        return this.birthday;
    }

    /**
     * Set the member's birthday configuration object.
     * 
     * @param {Object} birthday An object containing the member's DOB and a flag indicating whether to display birthday and age.
     */
    setBirthday(birthday) {
        this.birthday = birthday;
    }

    /**
     * Get the member's cover photo type.
     * 
     * @returns {"uploaded"|"link"} The cover photo type ('uploaded', 'link').
     */
    getCoverPhotoType() {
        return this.coverPhotoType;
    }

    /**
     * Set the member's cover photo type.
     * 
     * @param {"uploaded":"link"} coverPhotoType - The cover photo type ('uploaded', 'link'). 
     */
    setCoverPhotoType(coverPhotoType) {
        this.coverPhotoType = coverPhotoType;
    }

    /**
     * Get the member's cover photo identifier.
     * 
     * @returns {number} The cover photo identifier.
     */
    getCoverPhotoId() {
        return this.coverPhotoId;
    }

    /**
     * Set the member's cover photo identifier.
     * 
     * @param {number} coverPhotoId - The cover photo identifier.
     */
    setCoverPhotoId(coverPhotoId) {
        this.coverPhotoId = coverPhotoId;
    }

    /**
     * Get the member's cover photo link.
     * 
     * @returns {string} The link to the cover photo.
     */
    getCoverPhotoLink() {
        return this.coverPhotoLink;
    }

    /**
     * Set the member's cover photo link.
     * 
     * @param {string} coverPhotoLink - The link to the cover photo.
     */
    setCoverPhotoLink(coverPhotoLink) {
        this.coverPhotoLink = coverPhotoLink;
    }

    /**
     * Get the Date of when the member joined.
     * 
     * @returns {Date} The date of when the member joined.
     */
    getJoined() {
        return this.joined;
    }

    /**
     * Set the Date of when the member joined.
     * 
     * @param {Date} joined - The date of when the member joined.
     */
    setJoined(joined) {
        this.joined = joined;
    }

    /**
     * Get the total posts for the member.
     * 
     * @returns {number} The member's total posts.
     */
    getTotalPosts() {
        return this.totalPosts;
    }

    /**
     * Set the total posts for the member.
     * 
     * @param {number} totalPosts - The member's total posts. 
     */
    setTotalPosts(totalPosts) {
        this.totalPosts = totalPosts;
    }

    /**
     * Get the member's reputation score.
     * 
     * @returns {number} The member's reputation score value.
     */
    getReputation() {
        return this.reputation;
    }

    /**
     * Set the member's reputation score.
     * 
     * @param {number} reputation - The member's reputation score value.
     */
    setReputation(reputation) {
        this.reputation = reputation;
    }

    /**
     * Get the object of the member's followers.
     * 
     * @returns {Object} An object containing all the members following this member.
     */
    getFollowers() {
        return this.followers;
    }

    /**
     * Set the object of the member's followers.
     * 
     * @param {Object} followers - An object containing all the members following this member.
     */
    setFollowers(followers) {
        this.followers = followers;
    }

    /**
     * Get the member's location.
     * 
     * @returns {string} The member's location.
     */
    getLocation() {
        return this.location;
    }

    /**
     * Set the member's location.
     * 
     * @param {string} location - The member's location.
     */
    setLocation(location) {
        this.location = location;
    }

    /**
     * Get the member's gender.
     * 
     * @returns {string} The member's gender.
     */
    getGender() {
        return this.gender;
    }

    /**
     * Set the member's gender.
     * 
     * @param {string} gender - The member's gender.
     */
    setGender(gender) {
        this.gender = gender;
    }

    /**
     * Get the member's toggles object.
     * 
     * @returns {Object} An object with various setting toggles.
     */
    getToggles() {
        return this.toggles;
    }

    /**
     * Set the member's toggles object.
     * 
     * @param {Object} toggles - An object with various setting toggles.
     */
    setToggles(toggles) {
        this.toggles = toggles;
    }

    /**
     * Get the collection of the member's pronouns.
     * 
     * @returns {string[]} An array of the member's pronouns.
     */
    getPronouns() {
        return this.pronouns;
    }

    /**
     * Set the collection of the member's pronouns.
     * 
     * @param {string[]} pronouns - An array of the member's pronouns.
     */
    setPronouns(pronouns) {
        this.pronouns = pronouns;
    }

    /**
     * Get the pronunciation for the member.
     * 
     * @returns {string} The string describing how to pronounce the member's name,
     */
    getPronunciation() {
        return this.pronunciation;
    }

    /**
     * Set the pronunciation for the member.
     * 
     * @param {string} pronunciation - The string describing how to pronounce the member's name.
     */
    setPronunciation(pronunciation) {
        this.pronunciation = pronunciation;
    }

    /**
     * Get the member's website URL.
     * 
     * @returns {string} The member's website URL.
     */
    getWebsiteUrl() {
        return this.websiteUrl;
    }

    /**
     * Set the member's website URL.
     * 
     * @param {string} websiteUrl - The member's website URL.
     */
    setWebsiteUrl(websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    /**
     * Get the editor configurations for this member.
     * 
     * @returns {Object} An object containing the editor settings for this member.
     */
    getEditorConfigs() {
        return this.editorConfigs;
    }

    /**
     * Set the editor configurations for this member.
     * 
     * @param {Object} editorConfigs - An object containing the editor settings for this member.
     */
    setEditorConfigs(editorConfigs) {
        this.editorConfigs = editorConfigs;
    }

    /**
     * Get whether to censor bad words.
     * 
     * @returns {boolean} True to censor bad words, false not to.
     */
    getCensor() {
        return this.censor;
    }

    /**
     * Set whether to censor bad words.
     * 
     * @param {boolean} censor True to censor bad words, false not to.
     */
    setCensor(censor) {
        this.censor = censor;
    }

    /**
     * Get the character to censor bad words with.
     * 
     * @returns {string} The character to censor words with.
     */
    getCensorChar() {
        return this.censorChar;
    }

    /**
     * Set the character to censor bad words with.
     * 
     * @param {string} censorChar - The character to censor words with.
     */
    setCensorChar(censorChar) {
        this.censorChar = censorChar;
    }

    /**
     * Get the member's signature.
     * 
     * @returns {string} The member's signature.
     */
    getSignature() {
        return this.signature;
    }

    /**
     * Set the member's signature.
     * 
     * @param {string} signature - The member's signature. 
     */
    setSignature(signature) {
        this.signature = signature;
    }

    /**
     * Get the BBIC settings object for this member.
     * 
     * @returns {Object} An object containing the BBIC settings for this member.
     */
    getBBIC() {
        return this.bbic;
    }

    /**
     * Set the BBIC settings object for this member.
     * 
     * @param {Object} bbic - An object containing the BBIC settings for this member.
     */
    setBBIC(bbic) {
        this.bbic = bbic;
    }

    /**
     * Get the URL to the member's profile.
     * 
     * @returns {string} The URL web address to the member's profile.
     */
    url() {
        return `${UtilHelper.buildUrl(['profile'])}/${UtilHelper.addIdAndNameToUrl(this.getId(), this.getName())}`;
    }

    /**
     * Build the link for the member's profile.
     * 
     * @param {Object} [options={}] - Options for building the member's profile link.
     * @param {boolean} [options.includeGroupColor=true] - True to include the group color, false not to.
     * @param {boolean} [options.includeGroupEmphasize=true] - True to include the group emphasize, false not to.
     * @param {string} [options.separator=null] - A separating character(s) to seperate this link from others.
     * @param {string} [options.tooltip=null] - A tooltip for the link.
     * @param {string} [options.tooltipPlacement='top'] - Where the tooltip should be placed ('top', 'left', 'right' or 'bottom').
     * @returns {string} The member's profile link source. 
     */
    link(options = {}) {
        const {
            includeGroupColor = true,
            includeGroupEmphasize = true,
            separator = null,
            tooltip = null,
            tooltipPlacement = 'top',
        } = options;

        return OutputHelper.getPartial('memberEntity', 'link', {
            name: this.getName(),
            url: this.url(),
            includeGroupColor,
            includeGroupEmphasize,
            separator,
            tooltip,
            tooltipPlacement,
            groupColor: this.getPrimaryGroup().getColor(),
            groupEmphasize: this.getPrimaryGroup().isEmphasized(),
            darkenedColor: UtilHelper.generateDarkenedColor(this.getPrimaryGroup().getColor()),
        });
    }

    /**
     * Get the profile photo for the member.
     * 
     * @param {Object} [options={}] - Options for profile photo.
     * @param {"normal"|"thumbnail"|"post"} [options.type='normal'] - The profile photo type ('normal', 'thumbnail', or 'post').
     * @param {string} [options.url=false] - True to include the URL to the member's profile, false not to include an URL.
     * @returns {string} The profile photo source HTML.
     */
    async profilePhoto(options = {}) {
        if (this.getId() === 0 && this.getName() === 'Guest') {
            return this.buildNoPhoto('G', options);
        }

        const firstLetter = this.getName().substring(0, 1);

        if (!this.getPhotoType() || !this.getPhotoId()) {
            return this.buildNoPhoto(firstLetter, options);
        }

        const cache = CacheProviderFactory.create();
        
        switch (this.getPhotoType()) {
            case 'uploaded':
                const data = cache.get('member_photos').find(photo => photo.id === this.getPhotoId());
                const exists = data ? true : false;

                if (!exists) {
                    return this.buildNoPhoto(firstLetter, options);
                }

                const uploadsDir = Settings.get('uploadsDir');
                const photosDir = Settings.get('profilePhotosDir');
                const photoUrl = `${process.env.BASE_URL}/${uploadsDir}/${photosDir}/member-${this.getId()}/${data.fileName}`;

                const urlExists = await UtilHelper.urlExists(photoUrl);

                return urlExists ? this.buildPhoto(photoUrl, options) : this.buildNoPhoto(firstLetter, options);
        }
    }

    /**
     * Build the photo.
     * 
     * @param {string} source - The source of the image.
     * @param {Object} [options={}] - Options for building the photo.
     * @param {"normal"|"thumbnail"|"post"} [options.type='normal'] - The profile photo type ('normal', 'thumbnail', or 'post').
     * @param {boolean} [options.url=false] - True to include the URL to the member's profile, false not to include an URL.
     * @returns {string} The profile photo source HTML.
     */
    buildPhoto(source, options = {}) {
        const { type = 'normal', url = false } = options;

        return OutputHelper.getPartial('memberEntity', 'photo', {
            source,
            url: url ? this.url() : null,
            type,
        });
    }

    /**
     * Build the no photo.
     * 
     * @param {string} letter - The first letter of the member's name or the first letter of guest.
     * @param {Object} [options={}] - Options for building the no photo.
     * @param {"normal"|"thumbnail"|"post"} [options.type='normal'] - The profile photo type ('normal', 'thumbnail', or 'post').
     * @param {boolean} [options.url=false] - True to include the URL to the member's profile, false not to include an URL.
     * @returns {string} The no photo source HTML.
     */
    buildNoPhoto(letter, options = {}) {
        const { type = 'normal', url = false } = options;
        const colors = Settings.get('noPhotoColors');

        return OutputHelper.getPartial('memberEntity', 'noPhoto', {
            letter,
            url: url ? this.url() : null,
            type,
            backgroundColor: colors[letter].background,
            textColor: colors[letter].text,
        });
    }

    /**
     * Get the member's cover photo.
     * 
     * @returns {Promise<string|null>} A promise that resoloves to the URL to the cover photo or null if no cover photo is set.
     */
    async coverPhoto() {
        const baseUrl = process.env.BASE_URL;

        if (typeof this.getCoverPhotoId() === 'number') {
            switch (this.getCoverPhotoType()) {
                case 'uploaded':
                    const uploadsDir = Settings.get('uploadsDir');
                    const coverPhotosDir = Settings.get('coverPhotoDir');
                    const coverPhotoBaseUrl = `${baseUrl}/${uploadsDir}/${coverPhotosDir}/member-${this.getId()}`;
                    const cache = CacheProviderFactory.create();
                    const coverPhotosCache = cache.get('member_cover_photos');
                    const coverPhoto = coverPhotosCache.find(photo => photo.id === this.getCoverPhotoId());
                    if (!coverPhoto) return null;
                    const coverPhotoUrl = `${coverPhotoBaseUrl}/${coverPhoto.fileName}`;
                    const exists = await UtilHelper.urlExists(coverPhotoUrl);
                    return exists ? coverPhotoUrl : null;
            }
        }

        return null;
    }

    /**
     * Check whether the member is a moderator.
     * 
     * @returns {boolean} True if a moderator, false if not.
     */
    isModerator() {
        if (this.getPrimaryGroup().isModerator) {
            return true;
        }

        const secondaryGroups = this.getSecondaryGroups();

        if (secondaryGroups && Array.isArray(secondaryGroups) && secondaryGroups.length > 0) {
            secondaryGroups.forEach(group => {
                if (group.isModerator) {
                    return true;
                }
            });
        }

        return false;
    }

    /**
     * Check whether the member is an admin.
     * 
     * @returns {boolean} True if an admin, false if not.
     */
    isAdmin() {
        if (this.getPrimaryGroup().isAdmin) {
            return true;
        }

        const secondaryGroups = this.getSecondaryGroups();

        if (secondaryGroups && Array.isArray(secondaryGroups) && secondaryGroups.length > 0) {
            secondaryGroups.forEach(group => {
                if (group.isAdmin) {
                    return true;
                }
            });
        }

        return false;
    }

    /**
     * Get the parsed gender.
     * 
     * @returns {string} The parsed gender.
     */
    getParsedGender() {
        const availableGenders = Settings.get('availableGenderOptions');

        const data = availableGenders.find(
            gender => gender.label.toLowerCase() === this.getGender().toLowerCase()
        );

        const inList = data ? true : false;

        if (inList) {
            if (data.custom) {
                return this.getGender();
            } else {
                return data.label;
            }
        } else {
            return this.getGender();
        }
    }

    /**
     * Returns the parsed pronouns into a string.
     * 
     * @returns {string} The member's preferred pronouns.
     */
    getParsedPronouns() {
        if (this.getPronouns()) {
            const pronounsArr = this.getPronouns();
            let pronouns = '';

            pronounsArr.forEach(pronoun => {
                if (pronouns === '') {
                    pronouns += pronoun;
                } else {
                    pronouns += `, ${pronoun}`;
                }
            });

            return pronouns;
        }

        return '';
    }

    /**
     * Calculates and returns the current disk usage by this member.
     * 
     * @returns {number} The total disk usage in bytes.
     */
    getCurrentDiskUsage() {
        const cache = CacheProviderFactory.create();
        const attachments = cache.get('member_attachments').filter(attachment => attachment.memberId === this.getId());
        let totalBytes = 0;

        attachments.forEach(attachment => {
            totalBytes += parseFloat(attachment.fileSize);
        });

        return totalBytes;
    }
}

module.exports = Member;