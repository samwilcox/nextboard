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
const UtilHelper = require('../helpers/utilHelper');
const LocaleHelper = require('../helpers/localeHelper');
const { version } = require('../../package.json');
const DateTimeHelper = require('../helpers/dateTimeHelper');
const PermissionsService = require('./permissionsService');
const Features = require('../types/features');
const DataStoreService = require('./dataStoreService');
const OutputHelper = require('../helpers/outputHelper');

/**
 * GlobalsService that handles all global data.
 */
class GlobalsService {
    static instance = null;

    /**
     * Returns a new instance of GlobalsService.
     */
    constructor() {
        this.globals = {};
    }

    /**
     * Get the singleton instance of GlobalsService.
     * 
     * @returns {GlobalsService} The singleton instance of GlobalsService.
     */
    static getInstance() {
        if (!GlobalsService.instance) {
            GlobalsService.instance = new GlobalsService();
        }

        return GlobalsService.instance;
    }

    /**
     * Get all the global data.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} The globals object instance.
     */
    async get(req) {
        const member = req.member;
        this.globals.member = member;
        this.globals.settings = Settings.getAllRaw();
        this.globals.baseUrl = process.env.BASE_URL;
        this.globals.themeCssUrl = member.getConfigs().themeCssUrl;
        this.globals.imagesetUrl = member.getConfigs().imagesetUrl;
        const css = require(`../../themes/${member.getConfigs().themeFolder}/css`);
        this.globals.css = css;
        this.globals.breadcrumbs = UtilHelper.getBreadcrumbs();
        this.globals.locale = req.locale;
        this.globals.localeThemeData = UtilHelper.getLocaleAndThemeListing();
        this.globals.signInUrl = UtilHelper.buildUrl(['auth','signin']);
        this.globals.signUpUrl = UtilHelper.buildUrl(['signup']);
        this.globals.signedIn = member.isSignedIn();
        this.globals.csrfToken = req._csrfToken || null;
        this.globals.poweredBy = LocaleHelper.replaceAll('global', 'poweredBy', {
            link: UtilHelper.buildLink('NextBoard', {
                url: 'https://www.nextboard.org',
                target: '_blank',
                emphasize: true,
            }),
            version,
        });
        this.globals.allTimes = LocaleHelper.replaceAll('global', 'allTimes', {
            timeZone: member.getDateTime().timeZone,
            gmt: DateTimeHelper.getGmtOffset(),
        });

        this.globals.permissions = PermissionsService.getFeaturePermissions([
            Features.FORUMS,
            Features.MEMBERS,
            Features.WHOS_ONLINE,
            Features.TAGS,
            Features.SEARCH,
            Features.HELP,
            Features.CALENDAR,
            Features.UNREAD_CONTENT,
            Features.LATEST_CONTENT
        ]);

        this.globals.showBreadcrumbs = DataStoreService.get('showBreadcrumbs') || false;
        DataStoreService.set('showBreadcrumbs', false);

        this.globals._urls = {
            forumsMenu: UtilHelper.buildUrl(),
            membersMenu: UtilHelper.buildUrl(['members']),
            whosOnlineMenu: UtilHelper.buildUrl(['whosonline']),
            tagsMenu: UtilHelper.buildUrl(['tags']),
            searchMenu: UtilHelper.buildUrl(['search']),
            helpMenu: UtilHelper.buildUrl(['help']),
            accountSettings: UtilHelper.buildUrl(['account']),
            manageProfile: UtilHelper.buildUrl(['profile', 'manage']),
            viewProfile: `${UtilHelper.buildUrl(['profile'])}/${UtilHelper.addIdAndNameToUrl(member.getId(), member.getName())}`,
            notificationSettings: UtilHelper.buildUrl(['account', 'notifications']),
            messenger: UtilHelper.buildUrl(['messenger']),
            moderatorToolBox: UtilHelper.buildUrl(['moderatortoolbox']),
            administratorControlPanel: UtilHelper.buildUrl([process.env.ADMINCP_FOLDER]),
            signOut: UtilHelper.buildUrl(['auth', 'signout']),
            calendarMenu: UtilHelper.buildUrl(['calendar']),
            unreadContent: UtilHelper.buildUrl(['index', 'unread']),
            latestContent: UtilHelper.buildUrl(['index', 'latest']),
            markAll: UtilHelper.buildUrl(['index', 'markall']),
        };

        const selectedMenuItem = DataStoreService.get('selectedMenuItem');
        this.globals.selectedMenuItem = selectedMenuItem ? selectedMenuItem : null;

        this.globals.css = css();
        this.globals.isModerator = member.isModerator();
        this.globals.isAdmin = member.isAdmin();
        this.globals.fontFamilies = JSON.stringify(Settings.get('editorFonts'));
        
        const minFontSize = Settings.get('editorMinFontSize');
        const maxFontSize = Settings.get('editorMaxFontSize');
        const fontSizes = [];

        for (let i = minFontSize; i <= maxFontSize; i++) {
            fontSizes.push({
                name: i,
                size: `${i}px`,
            });
        }

        this.globals.fontSizes = JSON.stringify(fontSizes);
        this.globals.fontColors = JSON.stringify(Settings.get('editorFontColors'));
        this.globals.api = {
            giphy: {
                key: Buffer.from(Settings.get('giphyApiKey')).toString('base64'),
                url: Settings.get('giphyApiUrl'),
            },
        };

        this.globals.flags = member.getEditorConfigs();
        this.globals.photo = member.isSignedIn() ? await member.profilePhoto({ type: 'thumbnail' }) : null;
        this.globals.dialogs = OutputHelper.getPartial('global', 'dialogs', { dialogs: UtilHelper.getDialogs() });

        return this.globals;
    }
}

module.exports = GlobalsService.getInstance();