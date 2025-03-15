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
const UtilHelper = require('./utilHelper');
const Settings = require('../settings');
const LocaleHelper = require("./localeHelper");
const UploaderHelper = require('./uploaderHelper');
const DataStoreService = require('../services/dataStoreService');

/**
 * Helpers for building and managing the NextBoard text editor.
 */
class EditorHelper {
    /**
     * Build the text editor component.
     * 
     * @returns {Object} An object containing the editor and its identifier.
     */
    static build() {
        const id = UtilHelper.getUuid();
        const minFontSize = Settings.get('editorMinFontSize');
        const maxFontSize = Settings.get('editorMaxFontSize');
        const fontSizes = [];

        for (let i = minFontSize; i <= maxFontSize; i++) {
            fontSizes.push({
                name: i,
                size: `${i}px`,
            });
        }

        const editorConfigs = MemberService.getMember().getEditorConfigs();

        return {
            id,
            component: OutputHelper.getPartial('editorHelper', 'editor', {
                themeCssUrl: MemberService.getMember().getConfigs().themeCssUrl,
                baseUrl: process.env.BASE_URL,
                id,
                fonts: Settings.get('editorFonts'),
                fontSizes,
                fontColors: Settings.get('editorFontColors'),
                toolbar: editorConfigs.toolbar,
                flags: editorConfigs,
            }),
        };
    }

    /**
     * Build the "quick reply" component.
     * 
     * @param {Object} options - Options for building the quick reply component.
     * @param {string} options.formAction - The form action.
     * @param {string} [options.onSubmit=null] - Optional JS onsubmit action.
     * @param {Object} [options.dataFields=null] - An object containing key-value pairs for data attributes.
     * @param {Object} [options.hiddenFields=null] - Object containing key-value pairs for hidden fields.
     * @param {boolean} [options.includeUploader=true] - True to include the uploader, false not to.
     * @param {boolean} [options.includeFollow=true] - True to include the follow option, false not to.
     * @param {string} [options.followWordage='Follow'] - The wordage for the follow option.
     * @param {boolean} [options.marginTop=false] - True to include a top margin, false not to.
     * @param {boolean} [options.marginBottom=false] - True to include a bottom margin, false not to.
     * @param {"attachment"|"photo"|"cover"} [options.uploadType='attachment'] - The upload type if uploader is included.
     * @param {string} [options.buttonWordage='Submit'] - The wordage for the submit button.
     * @param {string} [options.initialText] - The initial text to display on the quick reply component.
     * @param {boolean} [options.includeCSRF=false] - True to include CSRF protection, false not to.
     * @param {boolean} [options.includeTags=false] - True to include input for tags, false not to.
     * @param {boolean} [options.includeSignature=true] - True to include an option to include signature, false not to.
     * @returns {Object} An object containing the quick reply component and the editor and uploader identifiers.
     */
    static async buildQuickReply(options) {
        const {
            onSubmit = null,
            dataFields = null,
            hiddenFields = null,
            includeUploader = true,
            includeFollow = true,
            followWordage = LocaleHelper.get('editorHelper', 'follow'),
            marginTop = false,
            marginBottom = false,
            uploadType = 'attachment',
            buttonWordage = LocaleHelper.get('editorHelper', 'submit'),
            initialText = LocaleHelper.get('editorHelper', 'initial'),
            includeCSRF = false,
            includeTags = false,
            includeSignature = true,
        } = options;

        const member = MemberService.getMember();

        if (!options.formAction) {
            throw new Error(LocaleHelper.get('errors', 'quickReplyInvalidAction'));
        }

        const editor = this.build();
        let uploaderComponent = null, uploaderId = null, tagsField = null, signature = false, signatureSelected = false;

        if (includeUploader) {
            const uploader = UploaderHelper.build({
                marginTop: true,
                type: uploadType,
            });

            uploaderComponent = uploader.component;
            uploaderId = uploader.id;
        }

        const req = DataStoreService.get('request');

        if (includeTags) {
            tagsField = UtilHelper.buildTagsInput({ id: editor.id });
        }

        if (includeSignature) {
            if (member.isSignedIn()) {
                if (member.getToggles().display.includeSignature) {
                    signatureSelected = true;
                }

                signature = true;
            }
        }

        return {
            component: OutputHelper.getPartial('editorHelper', 'quick-reply', {
                formAction: options.formAction,
                onSubmit,
                dataFields,
                hiddenFields,
                editor: editor.component,
                editorId: editor.id,
                marginTop,
                marginBottom,
                uploaderComponent,
                includeFollow,
                photo: await member.profilePhoto({ type: 'thumbnail', url: false }),
                followWordage,
                buttonWordage,
                initialText,
                includeCSRF,
                csrfToken: req._csrfToken || null,
                includeTags,
                tagsField: tagsField.input,
                signature,
                signatureSelected,
            }),
            editorId: editor.id,
            uploaderId,
        };
    }
}

module.exports = EditorHelper;