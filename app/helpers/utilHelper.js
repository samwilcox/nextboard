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
const DataStoreService = require('../services/dataStoreService');
const MemberService = require('../services/memberService');
const OutputHelper = require('./outputHelper');
const slugify = require('slugify');
const tinycolor = require('tinycolor2');
const CookieHelper = require('./cookieHelper');
const CookieList = require('../lists/CookieList');
const DateTimeHelper = require('./dateTimeHelper');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const LocaleHelper = require('./localeHelper');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const MemberRepository = require('../repository/memberRepository');

/**
 * Helper methods for the most common and repetive tasks.
 */
class UtilHelper {
    /**
     * Get the index inside an array with a given needle.
     * 
     * @param {Array} arr - The array in which to get the index in. 
     * @param {any} needle - The value to get the index for.
     * @returns {number} The index of the value. 
     */
    static getIndexInArr(arr, needle) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === needle) {
                return i;
            }
        }
    }

    /**
     * Detects whether the user is a search bot.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} Object containing resulting data.
     */
    static detectBots(req) {
        const userAgent = req.headers['user-agent'];
        const botData = { isBot: false, name: null };
        const bots = Settings.get('searchBotListing');

        if (bots) {
            for (const bot of bots) {
                const pattern = typeof bot.pattern === 'string' ? new RegExp(bot.pattern) : bot.pattern;

                if (pattern.test(userAgent)) {
                    botData.isBot = true;
                    botData.name = bot.name;
                    break;
                }
            }
        }

        return botData;
    }

    /**
     * Get the current user's IP address.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {string} The user's ip address.
     */
    static getUserIp(req) {
        let ip = req.ip;

        if (ip === '::1' || ip.startsWith('::ffff:')) {
            ip = '127.0.0.1';
        }

        return ip;
    }

    /**
     * Initializes the breadcrumbs array.
     */
    static initializeBreadcrumbs() {
        DataStoreService.set('breadcrumbs', []);
    }

    /**
     * Adds a new breadcrumb to the breadcrumbs array.
     * 
     * @param {string} title - The title of the breadcrumb.
     * @param {string} url - The URL web address for the breadcrumb.
     * @param {boolean} [selected=false] - True if the current breadcrumb, false if not.
     */
    static addBreadcrumb(title, url, selected = false) {
        let breadcrumbs = DataStoreService.get('breadcrumbs');

        if (!breadcrumbs.some(breadcrumb => breadcrumb.title === title)) {
            breadcrumbs.push({
                title,
                url,
                selected,
            });
        }

        DataStoreService.set('breadcrumbs', breadcrumbs);
    }

    /**
     * Returns the breadcrumbs collection.
     * 
     * @returns {Object[]} An array of breadcrumb objects.
     */
    static getBreadcrumbs() {
        return DataStoreService.get('breadcrumbs');
    }

    /**
     * Build an URL.
     * 
     * @param {string[]} [segments=null] - An array of segments of the URL (e.g., one/two/three) (default is null).
     * @param {Object} [options={}] - Options for building the URL.
     * @param {Object} [options.query=null] - Optional query string object (default is null).
     * @returns {string} The URL web address string. 
     */
    static buildUrl(segments = null, options = {}) {
        const {query = null } = options;
        let url = process.env.BASE_URL;
        let initial = true;
        if (!segments) return url;

        segments.forEach(segment => {
            url += `/${segment}`;
        });

        if (query) {
            for (const key in query) {
                url += `${initial ? '?' : '&'}${key}=${query[key]}`;
                initial = false;
            }
        }

        return url;
    }

    /**
     * Check if the current item in either the locale or theme is the one
     * selected by the user.
     * 
     * @param {number} itemId - The item identifier.
     * @param {string} [localeOrTheme='locale'] - If this for 'locale' or 'theme'.
     * @returns {boolean} True if is a selected item, false if not. 
     */
    static isLocaleOrThemeSelectedItem(itemId, localeOrTheme = 'locale') {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.getAll({ themes: 'themes', locale: 'locale' });
        const member = MemberService.getMember();

        switch (localeOrTheme) {
            case 'locale':
                return data.locale
                    .find(l => l.id === member.getLocaleId()) ? true : false;
            case 'theme':
                return data.themes
                    .find(t => t.id === member.getThemeId()) ? true : false;
            default:
                throw new Error(`Unsupported option for localeOrTheme: ${localeOrTheme}.`);
        }
    }

    /**
     * Gets a listing of both the locale and theme.
     * 
     * @returns {Object} An object containing both the locale and theme listing.
     */
    static getLocaleAndThemeListing() {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();
        const data = cache.getAll({ themes: 'themes', locale: 'locales' });
        const locales = [];
        const themes = [];

        const localeData = data.locale.sort((a, b) => a.localeCompare(b));
        const themeData = data.themes.sort((a, b) => a.localeCompare(b));

        localeData.forEach(locale => {
            const obj = {
                selected: this.isLocaleOrThemeSelectedItem(locale.id, 'locale'),
                name: locale.name,
                url: this.buildUrl(['select', 'locale', locale.id]),
            };

            locales.push(obj);
        });

        themeData.forEach(theme => {
            const obj = {
                selected: this.isLocaleOrThemeSelectedItem(theme.id, 'theme'),
                name: theme.name,
                url: this.buildUrl(['select', 'theme', theme.id]),
            };

            themes.push(obj);
        });

        return {
            locales,
            themes,
        };
    }

    /**
     * Build a link.
     * 
     * @param {string} title - The title of the link.
     * @param {Object} [options={}] - Options for building the link.
     * @param {string} [options.url=''] - The URL web address for this link (default is blank).
     * @param {boolean} [options.js=false] - True if the link is using javascript, false if just a normal link (default is false).
     * @param {string} [options.jsText=null] - The javascript string (e.g., onclick="callMe();") (default is null).
     * @param {Object} [options.data=null] - An object of key-value pairs for data parameters.
     * @param {string} [options.target=null] - The target window for the link to open in (default is null).
     * @param {string} [options.separator=null] - A separating character or characters to separate this link from others.
     * @param {string} [options.icon=null] - The icon to append to the beginning of the link (default is null).
     * @param {string} [options.trailingIcon=null] - The icon to place at the end of the link (default is null).
     * @param {string} [options.tooltip=null] - The tooltip text for the link (default is null).
     * @param {string} [options.tooltipPlacement='top'] - The placement of the tooltip from the link (default is 'top').
     * @param {string} [options.cssClasses=null] - An array of CSS classes to add to the link element.
     * @param {boolean} [options.emphasize=false] - True to bold the link, false for normal text for the link (default is false).
     * @returns {string} The resulting link source.
     */
    static buildLink(title, options = {}) {
        const {
            url = '',
            js = false,
            jsText = null,
            data = null,
            target = null,
            separator = null,
            icon = null,
            trailingIcon = null,
            tooltip = null,
            tooltipPlacement = null,
            cssClasses = null,
            emphasize = false,
        } = options;

        return OutputHelper.getPartial('utilHelper', 'link', {
            title,
            url,
            js,
            jsText,
            data,
            target,
            separator,
            icon,
            trailingIcon,
            tooltip,
            tooltipPlacement,
            cssClasses,
            emphasize,
        });
    }

    /**
     * Add an identifier and name to an URL and slugify the name.
     * 
     * @param {number|string} id - The identifier. 
     * @param {string} name - The name.
     * @returns {string} - The id and name slugified for an URL. 
     */
    static addIdAndNameToUrl(id, name) {
        const cleanedString = String(name).replace(/[^\w\s-]/g, '-'); 
        return `${id}/${slugify(cleanedString, { lower: true, replacement: '-' })}`;
    }

    /**
     * Formats a number into a human-readable format (e.g., 1.23K, 4.54M, 32.3B).
     * If this number is below 1000, it returns the number as-is in string format.
     * 
     * @param {number} number - The number to format.
     * @param {number} [decimals=2] - Number of decimal places to include (default is 2).
     * @returns {string} The formatted number. 
     */
    static formatNumber(number, decimals = 2) {
        if (number < 1000) {
            return number.toString();
        }

        const units = ["", "K", "M", "B", "T", "P", "E"];
        const index = Math.floor(Math.log10(number) / 3);
        const scaledNum = (number / Math.pow(1000, index)).toFixed(decimals);
        return `${scaledNum.replace(/\.?0+$/, "")}${units[index]}`;
    }

    /**
     * Generate a darker version of a given color.
     * 
     * @param {string} hexColor - The input color in HEX format (e.g., #000000).
     * @param {number} [darkenAmount=10] - The amount to darken the color (default is  10%).
     * @returns {string} The darkned color HEX value. 
     */
    static generateDarkenedColor(hexColor, darkenAmount = 10) {
        const baseColor = tinycolor(hexColor);

        if (!baseColor.isValid) {
            throw new Error('Invalid color code');
        }

        return baseColor.darken(darkenAmount).toHexString();
    }

    /**
     * Check if a given content is read.
     * 
     * @param {string} contentType - The content type (i.e., 'forum', topic', etc).
     * @param {number} contentId - The identifier of the content.
     * @param {Date} timestamp - The timestamp Date object.
     * @returns {boolean} True if is read, false if unread.
     */
    static isContentRead(contentType, contentId, timestamp) {
        const member = MemberService.getMember();
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();

        if (member.isSignedIn()) {
            const data = cache.get('content_tracker')
                .find(content =>
                    content.contentType === contentType &&
                    content.contentId === contentId &&
                    content.memberId === member.getId()
                );

            const exists = data ? true : false;

            if (!exists) return false;

            if (data.lastReadOn <= DateTimeHelper.dateToEpoch(timestamp)) {
                return true;
            } else {
                return true;
            }
        } else {
            const req = DataStoreService.get('request');

            if (CookieHelper.exists(req, CookieList.CONTENT_TRACKER)) {
                const tracker = JSON.parse(CookieHelper.get(req, CookieList.CONTENT_TRACKER));
                const trackerData = tracker
                    .find(tracker =>
                        tracker.contentType === contentType &&
                        tracker.contentId === contentId
                    );
                
                const exists = trackerData ? true : false;

                if (!exists) return false;

                if (trackerData.lastReadOn <= DateTimeHelper.dateToEpoch(timestamp)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    /**
     * Check if a given URL exists by sending a HEAD request.
     * 
     * @param {string} url - The URL to check.
     * @returns {Promise<boolean>} - Resolves to true if the URL exists, false otherwise.
     */
    static async urlExists(url) {
        try {
            const response = await axios.head(url, { timeout: 5000 });
            return response.status >= 200 && response.status < 400;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if the given content is valid.
     * 
     * @param {string} contentType - The content type string (e.g., 'topic', 'post', etc).
     * @param {number} contentId - The content identifier.
     * @returns {boolean} True if the given content is valid, false otherwise.
     */
    static isContentValid(contentType, contentId) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const cache = CacheProviderFactory.create();

        switch (contentType) {
            case 'topic':
                return cache.get('topics').find(topic => topic.id === parseInt(contentId, 10)) ? true : false;
            case 'post':
                return cache.get('posts').find(post => post.id === parseInt(contentId, 10)) ? true : false;
            default:
                return false;
        }
    }

    /**
     * Uppercase the first letter of a given string.
     * 
     * @param {string} str - The string to uppercase the first letter of.
     * @returns {string} The resulting string withthe first letter uppercased. 
     */
    static firstLetterToUppercase(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get the full URL of the current page.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {string} The current full URL address of the current page.
     */
    static getUrl(req) {
        return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    }

    /**
     * Build an error box.
     * 
     * @param {string} error - The error message.
     * @param {Object} [options={}] - Options for building the error box.
     * @param {boolean} [options.display=false] - True to display the error box, false to hide it.
     * @returns {string} The error box source. 
     */
    static buildErrorBox(error, options = {}) {
        const { display = false } = options;
        const id = uuidv4();

        return OutputHelper.getPartial('utilHelper', 'errorBox', {
            id,
            error,
            display,
        });
    }

    /**
     * Get the current referer.
     * 
     * @param {Object} req - The request object from Express.
     * @param {Object} [options={}] - Options for referer.
     * @param {boolean} [options.performCheck=true] - True to check the origin of the referer, false not to.
     * @returns {string} The referer URL string. 
     */
    static getReferer(req, options = {}) {
        const { performCheck = true } = options;
        const referer = req.headers.referer || req.headers.referrer;

        if (performCheck) {
            try {
                const urlObj = new URL(referer);
                const baseUrlObj = new URL(process.env.BASE_URL);

                if (urlObj.hostname === baseUrlObj.hostname) {
                    return referer;
                } else {
                    return UtilHelper.buildUrl();
                }
            } catch (error) {
                console.error('Invalid URL:', error);
                return null;
            }
        }

        return referer;
    }

    /**
     * Select the given menu item.
     * 
     * @param {string} item - The menu item to set as selected.
     */
    static selectMenuItem(item) {
        DataStoreService.set('selectedMenuItem', item);
    }

    /**
     * Get an unique UUID string.
     * 
     * @returns {string} The unique UUID string.
     */
    static getUuid() {
        return uuidv4();
    }

    /**
     * Cut data from a given array by the given parameters.
     * 
     * @param {Array} arr - The array of items. 
     * @param {number} from - The from index (index at which to start). 
     * @param {number} limit - The total number of items to cut from the array (e.g., perPage). 
     * @returns {Array} The sliced portion of the array.
     */
    static cutFromArray(arr, from, limit) {
        if (!Array.isArray(arr)) {
            throw new TypeError(LocaleHelper.get('errors', 'expectedArrayAsFirstArgument'));
        }

        if (typeof from !== 'number' || typeof limit !== 'number') {
            throw new TypeError(LocaleHelper.get('errors', 'expectedFromLimitToBeNumbers'));
        }

        if (from < 0) from = 0;
        if (limit < 0) limit = 0;

        return arr.slice(from, from + limit);
    }

    /**
     * Registers the dialog.
     * 
     * @param {string} dialog - The dialog source.
     * @param {Object} [options={}] - Options for registering the dialog.
     * @param {boolean} [options.overwrite=false] - True to overwrite the dialog, false not to.
     */
    static registerDialog(dialog, options = {}) {
        const { overwrite = false } = options;

        if (DataStoreService.exists('dialogs')) {
            let dialogs = DataStoreService.get('dialogs');
            const existingIndex = dialogs.indexOf(dialog);

            if (existingIndex === -1) {
                dialogs.push(dialog);
            } else if (overwrite) {
                dialogs[existingIndex] = dialog;
            }

            DataStoreService.set('dialogs', dialogs);
        } else {
            DataStoreService.set('dialogs', [dialog]);
        }
    }

    /**
     * Gets all the registered dialogs.
     * 
     * @returns {string} The dialogs source.
     */
    static getDialogs() {
        if (DataStoreService.exists('dialogs')) {
            let dialogData = '';
            const dialogs = DataStoreService.get('dialogs');

            dialogs.forEach(dialog => {
                dialogData += dialog;
            });

            return dialogData;
        }

        return '';
    }

    /**
     * Sanitizes HTML content before storing it in the database.
     * 
     * @param {string} dirtyHTML - The untrusted HTML input.
     * @returns {string} The sanitized HTML output.
     */
    static sanitizeHtml(dirtyHTML) {
        const window = new JSDOM('').window;
        const purify = DOMPurify(window);
        const dom = new JSDOM(dirtyHTML);
        const document = dom.window.document;

        const iframes = document.querySelectorAll('iframe');
        const trustedIframeSources = Settings.get('trustedIframeSources');

        iframes.forEach(frame => {
            const src = frame.getAttribute('src');

            if (src && !trustedIframeSources.some((regex) => regex.test(src))) {
                frame.remove();
            }
        });

        const config = {
            ALLOWED_TAGS: [
              'a', 'b', 'strong', 'i', 'em', 'img', 'iframe', 'ul', 'ol', 'li', 'table', 'tr', 'th', 'td', 'blockquote',
              'pre', 'code', 'hr', 'br', 'p', 'span', 'div', 'audio', 'video', 'source', 'button', 'form', 'input',
              'textarea', 'label', 'select', 'option', 'svg', 'math', 'noscript'
            ],
            ALLOWED_ATTR: [
              'href', 'src', 'alt', 'title', 'width', 'height', 'style', 'frameborder', 'allowfullscreen', 'class', 'id', 'rel',
              'controls', 'type', 'placeholder', 'autoplay', 'muted', 'loop', 'target', 'aria-*'
            ],
            SAFE_FOR_JQUERY: true,
          };

        return purify.sanitize(dom.serialize(), config);
    };

    /**
     * Builds the tags input field.
     * 
     * @param {Object} [options={}] - Options for building the tags input.
     * @param {any} [id=null] - A custom identifier or leave null for a generated identifier.
     * @returns {Object} The tags input field data object.
     */
    static buildTagsInput(options = {}) {
        let { id = null } = options;

        if (!id) {
            id = this.getUuid();
        }

        return {
            input: OutputHelper.getPartial('utilHelper', 'tags-input', { id }),
            id,
        };
    }

    /**
     * Returns whether the user has viewed the given content.
     * 
     * @param {"topic"} contentType - The content type.  
     * @param {number} contentId - The content identifier. 
     * @param {number} [memberId=null] - Optional member identifier (default is current user).
     * @returns {boolean} True if the given user has viewed the content, false if not. 
     */
    static hasViewedContent(contentType, contentId, memberId = null) {
        const CacheProviderFactory = require('../data/cache/cacheProviderFactory');
        const member = memberId ? MemberRepository.getMemberById(memberId) : MemberService.getMember();
        const cache = CacheProviderFactory.create();

        if (member.isSignedIn()) {
            return cache.get('content_views_tracker')
                .find(
                    c => c.contentType === contentType && c.contentId === parseInt(contentId, 10) && c.memberId === member.getId()
            ) ? true : false;
        } else {
            const req = DataStoreService.get('request');

            if (CookieHelper.exists(req, CookieList.CONTENT_VIEWS_TRACKER)) {
                return JSON.parse(CookieHelper.get(req, CookieList.CONTENT_VIEWS_TRACKER))
                        .find(c => c.contentType === contentType && c.contentId === parseInt(contentId, 10)
                );
            } else {
                return false;
            }
        }
    }

    /**
     * Get a random number between a min and max value.
     * 
     * @param {number} min - The minimum number.
     * @param {number} max - The maximum number.
     * @returns {number} The random number between the min and max numbers.
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } 
}

module.exports = UtilHelper;