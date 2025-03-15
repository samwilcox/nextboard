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

const LocaleHelper = require('./localeHelper');
const FileHelper = require('./fileHelper');
const ejs = require('ejs');
const path = require('path');
const MemberService = require('../services/memberService');

/**
 * Helpers for outputing HTML to the web browser.
 */
class OutputHelper {
    /**
     * Get the given partial.
     * 
     * @param {string} category - The category name.
     * @param {string} partial - The name of the partial.
     * @param {Object[]} vars - Options variables.
     * @returns {string} The resulting partial source. 
     * @throws {Error} If the partial is not found or if rendering fails.
     */
    static getPartial(category, partial, vars = {}) {
        try {
            const member = MemberService.getMember();
            const partialPath = path.join(member.getConfigs().themePath, category, `${partial}.ejs`);
            const template = FileHelper.readFile(partialPath);

            if (!template) {
                throw new Error(`Partial not found at path: ${partialPath}`);
            }

            const locale = LocaleHelper.getAll();

            return ejs.render(template, { ...vars, locale }, { async: false });
        } catch (error) {
            console.error(`Error rendering partial: ${error.message}.`);
        }
    }
}

module.exports = OutputHelper;