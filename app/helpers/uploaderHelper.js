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

const OutputHelper = require("./outputHelper");
const MemberService = require('../services/memberService');
const LocaleHelper = require("./localeHelper");
const FileHelper = require("./fileHelper");
const Settings = require('../settings');
const UtilHelper = require("./utilHelper");

/**
 * UploaderHelper contains helpers for building and managing the file uploader component.
 */
class UploaderHelper {
    /**
     * Build the file uploader component.
     * 
     * @param {Object} [options={}] - Options for building the file uploader component.
     * @param {boolean} [options.marginTop=false] - True to include a margin above the component, false not to.
     * @param {boolean} [options.marginBottom=false] - True to include a margin below the component, false not to.
     * @param {"attachment"|"photo"|"cover"} [options.type='attachment'] - The file upload type.
     * @returns {Object} An object containing the file uploader data. 
     */
    static build(options = {}) {
        const { marginTop = false, marginBottom = false, type = 'attachment' } = options;
        const configs = MemberService.getConfigs();
        const id = UtilHelper.getUuid();

        return {
            component: OutputHelper.getPartial('uploaderHelper', 'uploader', {
                marginTop,
                marginBottom,
                themeCssUrl: configs.themeCssUrl,
                maxFileSize: LocaleHelper.replace('uploaderHelper', 'maxFileSize', 'size', FileHelper.formatFileSize(Settings.get('singleFileUploadSizeLimit'))),
                id,
                baseUrl: process.env.BASE_URL,
                type,
            }),
            id,
        };
    }
}

module.exports = UploaderHelper;