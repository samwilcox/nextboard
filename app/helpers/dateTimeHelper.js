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

const { DateTime } = require('luxon');
const LocaleHelper = require('./localeHelper');
const Settings = require('../settings');
const moment = require('moment-timezone');

/**
 * Helpers for working with date and times.
 */
class DateTimeHelper {
    /**
     * Convert a javascript Date object to epoch for saving into the database.
     * 
     * @param {Date} date - The javascript Date object to convert.
     * @returns {number} The epoch representation of the Date object. 
     */
    static dateToEpoch(date) {
        return date.getTime();
    }

    /**
     * Convert an epoch value to a javascript Date object.
     * 
     * @param {number} epoch - The epoch value to convert to a javascript Date object.
     * @returns {Date} The javascript Date object from the epoch value. 
     */
    static epochToDate(epoch) {
        return new Date(epoch);
    }

    /**
     * Get the GMT offset for the currently set timezone.
     * 
     * @returns {string} The GMT offset string.
     */
    static getGmtOffset() {
        const MemberService = require('../services/memberService');
        const member = MemberService.getMember();
        const dateTime = member.getDateTime();
        const now = DateTime.now().setZone(dateTime.timeZone);
        const offset = now.offset / 60;
        return `${offset}:00`;
    } 

    /**
     * Converts a time difference in seconds to a 'time ago' format.
     * 
     * @param {number} diffInSeconds - The time difference in seconds.
     * @returns {string} A human-readablke 'time ago' format.
     */
    static getTimeAgo(diffInSeconds) {
        const intervals = [
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'yearAgo'), label: LocaleHelper.get('dateTimeHelper', 'yearsAgo'), seconds: 31536000 },
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'monthAgo'), label: LocaleHelper.get('dateTimeHelper', 'monthsAgo'), seconds: 2592000 },
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'weekAgo'), label: LocaleHelper.get('dateTimeHelper', 'weeksAgo'), seconds: 604800 },
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'dayAgo'), label: LocaleHelper.get('dateTimeHelper', 'daysAgo'), seconds: 86400 },
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'hourAgo'), label: LocaleHelper.get('dateTimeHelper', 'hoursAgo'), seconds: 3600 },
            { singularLabel: LocaleHelper.get('dateTimeHelper', 'minuteAgo'), label: LocaleHelper.get('dateTimeHelper', 'minutesAgo'), seconds: 60 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);

            if (count >= 1) {
                return count > 1
                    ? interval.label.replace('${total}', count)
                    : interval.singularLabel.replace('${total}', count);
            }
        }

        return LocaleHelper.get('dateTimeHelper', 'justNow');
    }

    /**
     * Formats a given date.
     * 
     * @param {Date|number|string} timestamp - The timestamp to format. 
     * @param {Object} [options={}] - Options for formatting the date. 
     * @param {boolean} [options.timeOnly=false] - True to return only the time, false not to (default is false).
     * @param {boolean} [options.dateOnly=false] - True to return only the date, false not to (default is false).
     * @param {boolean} [options.timeAgo=false] - True to return a "human-readable" format if within a specified duration.
     */
    static dateFormatter(timestamp, options = {}) {
        const {
            timeOnly = false,
            dateOnly = false,
            timeAgo = false,
        } = options;

        const MemberService = require('../services/memberService');
        const member = MemberService.getMember();
        const dateTime = member.getDateTime();
        let inputDate;

        if (timestamp instanceof Date) {
            inputDate = DateTime.fromJSDate(timestamp);
        } else if (typeof timestamp === 'number') {
            inputDate = timestamp > 9999999999
                ? DateTime.fromMillis(timestamp)
                : DateTime.fromSeconds(timestamp);
        } else if (typeof timestamp === 'string') {
            inputDate = DateTime.fromISO(timestamp);
        } else {
            throw new Error(`Unsupported timestamp type: ${typeof timestamp}`);
        }

        if (!inputDate.isValid) {
            throw new Error('Invalid timestamp provided');
        }

        const now = DateTime.local();
        const diffInSeconds = now.diff(inputDate, 'seconds').seconds;
        const timeAgoDurationInSeconds = Settings.get('timeAgoDurationInDays') * 24 * 60 * 60;

        if (timeAgo && dateTime.timeAgo && diffInSeconds < timeAgoDurationInSeconds) {
            return this.getTimeAgo(diffInSeconds);
        }

        if (timeOnly) {
            return inputDate.setZone(dateTime.timeZone).toFormat(dateTime.timeFormat);
        }

        if (dateOnly) {
            return inputDate.setZone(dateTime.timeZone).toFormat(dateTime.dateFormat);
        }

        return inputDate.setZone(dateTime.timeZone).toFormat(dateTime.dateTimeFormat);
    }

    /**
     * Convert a string value to javascript Date object.
     * 
     * @param {string} str - The string time representation.
     * @param {number} [depth=0] - The depth to help prevent excessive recursion.
     * @returns {Date|null} The resulting javascript Date object representation or null if invalid.
     */
    static stringToDate(str, depth = 0) {
        if (!str || typeof str !== 'string') {
            return null;
        }

        str = str.trim();
        
        // Prevent excessive recursion
        if (depth > 10) return null;

        // Check for direct ISO, SQL, or Unix timestamps first
        let isoDate = DateTime.fromISO(str);
        if (isoDate.isValid) return isoDate.toJSDate();

        let sqlDate = DateTime.fromSQL(str);
        if (sqlDate.isValid) return sqlDate.toJSDate();

        if (/^\d{10}$/.test(str)) {
            let unixDate = DateTime.fromSeconds(parseInt(str, 10));
            if (unixDate.isValid) return unixDate.toJSDate();
        }

        // Handle relative time expressions (seconds, minutes, hours, days, weeks, months, years)
        const relativeMatch = str.match(/([+-]?\d+)\s*(seconds?|secs?|sec?|minutes?|mins?|min?|hours?|hrs?|hr?|days?|weeks?|months?|mnths?|mnth?|years?|yr?|yrs?)/i);
        if (relativeMatch) {
            const amount = parseInt(relativeMatch[1], 10);
            const unit = relativeMatch[2].toLowerCase();
            
            // Normalize unit to singular form
            const normalizedUnit = unit.replace(/s$/, "");

            return DateTime.now().plus({ [normalizedUnit]: amount }).toJSDate();
        }

        // Common date components for format generation
        const yearFormats = ["yyyy", "yy"];
        const monthFormats = ["MMMM", "MMM", "MM"];
        const dayFormats = ["d", "dd"];
        const separators = ["-", "/", ".", " "]; // Possible separators

        // Generate possible date formats
        let possibleFormats = [];
        for (let y of yearFormats) {
            for (let m of monthFormats) {
                for (let d of dayFormats) {
                    for (let sep of separators) {
                        possibleFormats.push(`${m}${sep}${d}${sep}${y}`);
                        possibleFormats.push(`${y}${sep}${m}${sep}${d}`);
                        possibleFormats.push(`${d}${sep}${m}${sep}${y}`);
                    }
                }
            }
        }

        // Add formats with time
        let timeFormats = ["HH:mm:ss", "HH:mm", "h:mm a"];
        for (let fmt of [...possibleFormats]) {
            for (let t of timeFormats) {
                possibleFormats.push(`${fmt} ${t}`);
            }
        }

        // Attempt parsing with generated formats
        for (const format of possibleFormats) {
            let date = DateTime.fromFormat(input, format);
            if (date.isValid) return date.toJSDate();
        }

        // Try parsing again with variations (removing extra spaces, trying other separators)
        const cleanedInput = str.replace(/\s+/g, " ").trim();
        if (cleanedInput !== str) {
            return this.stringToDate(cleanedInput, depth + 1);
        }

        return null;
    }

    /**
     * Calculates the start and end range of the desired timeframe.
     * 
     * @param {string} option - The time range option (e.g., 'alltime', 'today', etc).
     * @returns {Object} An object with the start and end for the range.
     */
    static getTimeRange(option) {
        const now = DateTime.local();
        let start, end;

        switch (option) {
            case 'all':
                start = DateTime.fromMillis(0);
                end = now;
                break;
            case 'today':
                start = now.startOf('day');
                end = now;
                break;
            case 'yesterday':
                start = now.minus({ days: 1 }).startOf('day');
                end = now.startOf('day');
                break;
            case '1days':
            case '2days':
            case '3days':
            case '4days':
            case '5days':
            case '6days':
                const daysAgo = parseInt(option);
                start = now.minus({ days: daysAgo }).startOf('day');
                end = now;
                break;
            case '1weeks':
            case '2weeks':
            case '3weeks':
                const weeksAgo = parseInt(option);
                start = now.minus({ weeks: weeksAgo }).startOf('day');
                end = now;
                break;
            case '1months':
            case '3months':
            case '6months':
            case '9months':
                const monthsAgo = parseInt(option);
                start = now.minus({ months: monthsAgo }).startOf('month');
                end = now;
                break;
            case '1years':
            case '2years':
            case '3years':
                const yearsAgo = parseInt(option);
                start = now.minus({ years: yearsAgo }).startOf('year');
                end = now;
                break;
            default:
                throw new Error("Invalid timeframe option");
        }

        return { start, end };
    }

    /**
     * Helper that generates various timeframes.
     * 
     * @param {string} [selected='any'] - The selected timeframe.
     * @returns {string[]} An array containing all the timeframes.
     */
    static generateTimeFrames(selected = 'all') {
        const now = new Date();
        const timeframes = [];

        timeframes.push({ label: LocaleHelper.get('dateTimeHelper', 'any'), from: null, name: 'any', selected: selected === 'all' });

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        timeframes.push({ label: LocaleHelper.get('dateTimeHelper', 'today'), from: startOfToday, name: 'today', selected: selected === 'today' });

        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        timeframes.push({ label: LocaleHelper.get('dateTimeHelper', 'yesterday'), from: startOfYesterday, name: 'yesterday', selected: selected === 'yesterday' });

        for (let i = 1; i <= 6; i++) {
            const daysAgo = new Date(startOfToday);
            daysAgo.setDate(daysAgo.getDate() - i);
            timeframes.push({ label: LocaleHelper.replace('dateTimeHelper', `day${i === 1 ? '' : 's'}Ago`, 'total', i), from: daysAgo, name: `${i}day${i === 1 ? '' : 's'}`, selected: selected === `${i}day${i === 1 ? '' : 's'}` });
        }

        for (let i = 1; i <= 3; i++) {
            const weeksAgo = new Date(startOfToday);
            weeksAgo.setDate(weeksAgo.getDate() - (i * 7));
            timeframes.push({ label: LocaleHelper.replace('dateTimeHelper', `week${i === 1 ? '' : 's' }Ago`, 'total', i), from: weeksAgo, name: `${i}week${i === 1 ? '' : 's'}`, selected: selected === `${i}week${i === 1 ? '' : 's'}` });
        }

        const monthsAgo = [
            { label: LocaleHelper.replace('dateTimeHelper', 'monthAgo', 'total', 1), months: 1, name: '1month', selected: selected === '1month' },
            { label: LocaleHelper.replace('dateTimeHelper', 'monthsAgo', 'total', 3), months: 3, name: '3months', selected: selected === '3months' },
            { label: LocaleHelper.replace('dateTimeHelper', 'monthsAgo', 'total', 6), month: 4, name: '6months' , selected: selected === '6months' },
            { label: LocaleHelper.replace('dateTimeHelper', 'monthsAgo', 'total', 9), months: 9, name: '9months', selected: selected === '9months' },
            { label: LocaleHelper.replace('dateTimeHelper', 'yearAgo', 'total', 1), months: 12, name: '1year', selected: selected === '1year' },
            { label: LocaleHelper.replace('dateTimeHelper', 'yearsAgo', 'total', 2), months: 24, name: '2years', selected: selected === '2years' },
            { label: LocaleHelper.replace('dateTimeHelper', 'yearsAgo', 'total', 3), months: 36, name: '3years', selected: selected === '3years' },
        ];

        monthsAgo.forEach(({ label, months, name, selected }) => {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - months);
            timeframes.push({ label, from: monthAgo, name, selected });
        });

        return timeframes;
    }

    /**
     * Get the current year.
     * 
     * @returns {number} The current year.
     */
    static getYear() {
        return new Date().getFullYear();
    }

    /**
     * Get the current month.
     * 
     * @returns {number} The current month.
     */
    static getMonth() {
        return new Date().getMonth() + 1;
    }

    /**
     * Get the current day.
     * 
     * @returns {number} The current day.
     */
    static getDay() {
        return new Date().getDate();
    }

    /**
     * Helper method to get the previous and next month.
     * 
     * @param {number} year - The current year.
     * @param {number} month - The current month (1-12).
     * @returns {Object} An object containing the previous and next month info.
     */
    static getPreviousAndNextMonth(year, month) {
        let prevMonth = month - 1;
        let prevYear = year;

        if (prevMonth < 1) {
            prevMonth = 12;
            prevYear -= 1;
        }

        let nextMonth = month + 1;
        let nextYear = year;

        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }

        return {
            previous: {
                year: prevYear,
                month: prevMonth,
            },
            next: {
                year: nextYear,
                month: nextMonth,
            }
        };
    }

    /**
     * Get a future Date object via the given options.
     * 
     * @param {Object} [options={}] - Options for getting the future date.
     * @param {number} [options.days=7] - The total days in the future (default is 7).
     * @param {number} [options.seconds=0] - The total seconds in the future (default is 0).
     * @param {number} [options.minutes=0] - The total minutes in the future (default is 0).
     * @param {number} [options.hours=0] - The total hours in the future (default is 0).
     * @param {number} [options.weeks=0] - The total weeks in the future (default is 0).
     * @param {number} [options.months=0] - The total months in the future (default is 0).
     * @param {number} [options.years=0] - The total years in the future (default is 0).
     * @returns {Date} The resulting Date object built on the given options.
     */
    static getFutureDate(options = {}) {
        const {
            days = 7,
            seconds = 0,
            minutes = 0,
            hours = 0,
            weeks = 0,
            months = 0,
            years = 0,
        } = options;

        const MemberService = require('../services/memberService');
        const member = MemberService.getMember();
        const now = moment.tz(member.getDateTime().timeZone);

        const futureDate = now
            .add(years, 'years')
            .add(months, 'months')
            .add(weeks, 'weeks')
            .add(days, 'days')
            .add(hours, 'hours')
            .add(minutes, 'minutes')
            .add(seconds, 'seconds');

        return futureDate;
    }
}

module.exports = DateTimeHelper;