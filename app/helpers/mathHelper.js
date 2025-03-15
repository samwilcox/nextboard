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

/**
 * Helpers for working with numbers.
 */
class MathHelper {
    /**
     * Calculate age by the given month, day and year parameters.
     * 
     * @param {number} month - The month number (can include leading 0).
     * @param {number} day - The day number (can include leading 0). 
     * @param {number} year - The year number (4-digit).
     * @returns {number} The calculated age. 
     */
    static calculateAge(month, day, year) {
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        let age = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassedThisYear = 
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassedThisYear) age--;

        return age;
    }

    /**
     * Calculate the percentage for the given poll option.
     * 
     * @param {number} totalVotes - The total votes for all options.
     * @param {number} optionTotalVotes - The total votes for the option.
     * @returns {string} The resulting percentage. 
     */
    static calculatePollOptionPercentage(totalVotes, optionTotalVotes) {
        return `${optionTotalVotes/totalVotes * 100}%`;
    }
} 

module.exports = MathHelper;