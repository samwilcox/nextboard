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

var dropDown = null;
var currentDialog = null;
var textEditors = {};
var selectedTags = {};
var activeSuggestionsBox = null;
var suggestionsBoxLegend = {};
var poll = {};

/**
 * Once the document is ready, then anything within here gets executed.
 */
$(document).ready(() => {
    $(document).click((event) => dropDownDetection(event));
    $(document).on('click', event => closeTagContainer(event));
    initializePoll();
});

/**
 * Detects if the user has clicked out of the drop down element.
 * 
 * @param {Object} event - The event object instance.
 */
const dropDownDetection = (event) => {
    if (!dropDown) return;
    let found = false;

    if (dropDown.hasOwnProperty('elementsList')) {
        for (let i = 0; i < dropDown.elementsList.length; i++) {
            if (event.target.id === dropDown.elementsList[i]) {
                found = true;
                break;
            }
        }
    }

    if (!found) {
        resetDropDown();
    }
};

/**
 * Reset the drop down.
 */
const resetDropDown = () => {
    if (dropDown) {
        $(`#${dropDown.element}`).slideUp();
        dropDown.link.removeClass(css.dropDownMenuSelector);
        dropDown = null;
    }
};

/**
 * Open the given drop down menu element.
 * 
 * @param {Object} element - The element object instance.
 */
const openDropDownMenu = (element) => {
    let menu = $(`#${$(element).data('menu')}`);
    let ignored = $(element).data('ignored');
    let ignoredElements = ignored ? ignored.split(',') : [];
    let linkElement = $(`#${$(element).data('link')}`);
    let spacing = parseInt($(element).data('spacing'), 10);

    resetDropDown();

    let difference = ($(window).width() - $(`#${ignoredElements[0]}`).offset().left);
    let spaceBelow = $(window).height() + $(window).scrollTop() - (linkElement.offset().top + linkElement.outerHeight());

    if (menu.width() >= difference) {
        menu.css({
            'left': (linkElement.offset().left - menu.width() + linkElement.width() + 'px')
        });
    } else {
        menu.css({
            'left': linkElement.offset().left + 'px'
        });
    }

    if (spaceBelow < menu.outerHeight()) {
        menu.css({
            'top': (linkElement.offset().top - menu.outerHeight() + 5 + (typeof(movement) !== 'undefined' ? movement : '')) + 'px'
        });
    } else {
        menu.css({
            'top': (linkElement.offset().top + linkElement.height() + 5 + (typeof(movement) !== 'undefined' ? movement : '')) + 'px'
        });
    }

    if (linkElement.parent().css('display') === 'flex') {
        menu.css({
            'left': (linkElement.position().left + 'px')
        });
    }

    if (spacing && typeof spacing === 'number') {
        menu.css({
            'top': `${linkElement.offset().top + spacing}px`
        });
    }

    linkElement.addClass(css.dropDownMenuSelector);

    menu.slideDown();
    ignoredElements.push($(element).data('link'));

    dropDown = {
        elementsList: ignoredElements,
        element: $(element).data('menu'),
        link: linkElement,
    };
};

/**
 * Toggle an element with a header and a content body.
 * 
 * @param {Object} element - The element instance.
 */
const toggle = (element) => {
    const header = $(`#${$(element).data('header')}`);
    const content = $(`#${$(element).data('content')}`);
    const icon = $(`#${$(element).data('icon')}`);
    const iconExpanded = $(element).data('icon-expanded');
    const iconCollapsed = $(element).data('icon-collapsed');

    if (content.is(':visible')) {
        setTimeout(() => {
            header.addClass('collapsed');
        }, 350);

        content.slideUp();
        icon.removeClass(iconExpanded);
        icon.addClass(iconCollapsed);
        
    } else {
        setTimeout(() => {
            header.removeClass('collapsed');
        }, 290);

        content.slideDown();
        icon.removeClass(iconCollapsed);
        icon.addClass(iconExpanded);
        
    }
};

/**
 * Close the error box element.
 * 
 * @param {Object} element - The element object instance.
 */
const closeErrorBox = (element) => {
    const box = $(`#${$(element).data('box')}`);
    box.fadeOut();
};

/**
 * Toggles the visibility of a password field.
 * 
 * @param {Object} element - The element object instance.
 */
const togglePassword = (element) => {
    const field = $(`#${$(element).data('field')}`);
    const icon = $(`#${$(element).data('icon')}`);
    const passwordIcon = $(element).data('icon-password');
    const textIcon = $(element).data('icon-text');

    if (icon.hasClass('toggled')) {
        icon.removeClass('toggled');
        icon.removeClass(textIcon);
        icon.addClass(passwordIcon);
        field.attr('type', 'password');
    } else {
        icon.addClass('toggled');
        icon.removeClass(passwordIcon);
        icon.addClass(textIcon);
        field.attr('type', 'text');
    }
};

/**
 * Toggle the visibility of the background disabler.
 * 
 * @param {boolean} visible - True for visible, false to hide.
 */
const toggleBackgroundDisabler = (visible) => {
    const bgd = $(`#background-disabler`);
    visible ? bgd.fadeIn() : bgd.fadeOut();
};

/**
 * Open the specified dialog element.
 * 
 * @param {Object} event - The event object instance.
 * @param {Object} element - The element object instance.
 * @param {number} [width=null] - Optional dialog width.
 */
const openDialog = (event, element, width = null) => {
    if (event) {
        event.preventDefault();
    }

    let dialog = null, dialogWidth = null;

    if (typeof element === 'string') {
        dialog = $(`#${element}`);

        if (width) {
            dialogWidth = width;
        } else {
            dialogWidth = 500;
        }
    } else {
        dialog = $(`#${$(element).data('dialog')}`);

        if ($(element).data('width') && !width) {
            try {
                dialogWidth = parseInt($(element).data('width'));
            } catch (error) {
                console.error('Failed to convert the given dialog width to a number:', error);
            }
        } else {
            if (width) {
                dialogWidth = width;
            } else {
                dialogWidth = 500;
            }
        }
    }

    if (!dialog || !dialog.length) {
        console.error('Dialog not found:', element);
        return;
    }

    dialog.css({
        width: `${dialogWidth}px`
    });

    closeDialog();
    toggleBackgroundDisabler(true);
    dialog.fadeIn({ queue: false, duration: 'slow' });
    dialog.animate({ 'marginTop': '+=30px' }, 400, 'easeInQuad');
    currentDialog = dialog.attr('id');
};

/**
 * Close the dialog element.
 */
const closeDialog = () => {
    if (currentDialog) {
        const dialog = $(`#${currentDialog}`);
        dialog.fadeOut({ queue: false, duration: 'slow' });
        dialog.animate({ 'marginTop': '-=30px' }, 400, 'easeInQuad');
        toggleBackgroundDisabler(false);
        currentDialog = null;
    }
};

/**
 * Open a dialog element directory.
 * 
 * @param {string} dialogId - The dialog identifier.
 * @param {number} [width=null] - Optional width in pixels for the dialog element. 
 */
const openDialogDirect = (dialogId, width = null) => {
    openDialog(null, dialogId, width);
};

/**
 * Toggle the preloader.
 * 
 * @param {Object} [options={}] - Options for toggling the preloader. 
 * @param {"intersection"} [options.preloader='intersection'] - The preloader to use.
 * @param {boolean} [options.show=true] - True to show the preloader, false to hide it.
 * @param {number} [options.top='50%'] - The top position of the preloader.
 * @param {number} [options.left='50%'] - The bottom position of the preloader.
 * @param {boolean} [options.transformTop=true] - True to transform the top using translateX, false not to.
 * @param {boolean} [options.transformLeft=true] - True to transform the left using translateX, false not to.
 */
const togglePreloader = (options = {}) => {
    const {
        preloader = 'intersection',
        show = true,
        top = '50%',
        left = '50%',
        transformTop = true,
        transformLeft = true,
    } = options;

    const preloaders = {
        intersection: `${imagesetUrl}/images/preloaders/intersection.gif`,
    };

    const preloaderSpan = $('#preloader');
    const preloaderImage = $('#preloader-image');
    const image = preloaders[preloader];

    preloaderImage.attr('src', image);

    if (top !== '50%') {
        preloaderSpan.css({ 'top': top });
    }

    if (left !== '50%') {
        preloaderSpan.css({ 'left': left });
    }

    if (transformTop || transformLeft) {
        let transformValue = '';

        if (transformTop) {
            transformValue += 'translateY(-50%) ';
        }

        if (transformLeft) {
            transformValue += 'translateX(-50%)';
        }

        preloaderSpan.css('transform', transformValue);
    } else {
        preloaderSpan.css('transform', 'none');
    }

    if (show) {
        preloaderSpan.fadeIn();
    } else {
        preloaderSpan.fadeOut();
    }
};

/**
 * Get the total browsing the given content.
 * 
 * @param {string} contentType - The content type.
 * @param {number} contentId - The content identifier.
 * @param {Object} [options={}] - Options for getting total browsing.
 * @param {boolean} [options.includeChildren=true] - True to include children, false not to. 
 * @param {boolean} [options.toLocale=false] - True to return locale version, false for just a number.
 * @returns {number} The total number of people browsing.
 */
const getTotalBrowsing = (contentType, contentId, options = {}) => {
    const { includeChildren = true, toLocale = false } = options;

    const data = {
        contentType,
        contentId,
        includeChildren,
        toLocale,
    };

    ajaxGet('browsing', response => {
        if (response.success) {
            return response.totalBrowsing;
        }
    }, data);
};

/**
 * Toggles like/unlike on the given content.
 * 
 * @param {Object} element - The element object instance.
 */
const toggleLike = (element) => {
    const mode = $(element).data('mode');
    const contentType = $(element).data('content-type');
    const contentId = parseInt($(element).data('content-id'), 10);
    const linkElement = $(`#${$(element).data('link')}`);
    const dialogSelector = $(`#dialogs-container #${$(element).data('dialog')}`);
    const data = { mode, contentType, contentId };

    ajaxPost('like', data, response => {
        if (response.success) {
            const data = response.data;
            const link = data.link;
            const dialogHtml = data.dialog;
            linkElement.html(link);
            dialogSelector.replaceWith(dialogHtml);
        }
    });
};

/**
 * Shows the quick reply when clicked on.
 * 
 * @param {Object} element - The element object instance.
 */
const showQuickReply = (element) => {
    const id = $(element).data('id');
    const click = $(`#quickreply-click-${id}`);
    const editor = $(`#quickreply-editor-${id}`);

    click.hide();
    editor.show();
};

/**
 * Reply to a given topic.
 * 
 * @param {Object} element - The element object instance.
 */
const replyToTopic = (element) => {
    const editorId = $(element).data('id');
    const box = $(`#quickreply-box-${editorId}`);
    const click = $(`#quickreply-click-${editorId}`);
    const editor = $(`#quickreply-editor-${editorId}`);
    const editorComponent = textEditors[editorId];

    $('html, body').animate({
        scrollTop: $(box).offset().top
    }, 1000);

    click.hide();
    editor.show();
    editorComponent.chain().focus();
};

/**
 * Opens the error dialog element.
 * 
 * @param {string} message - The error message to display.
 * @param {string} [title='Error'] - The error dialog title. 
 */
const openErrorDialog = (message, title = 'Error') => {
    const titleBox = $('#dialog-error-title');
    const messageBox = $('#dialog-error-message');

    if (!titleBox.length || !messageBox.length) {
        console.error('Error dialog elements not found in the DOM');
        return;
    }

    titleBox.html(title === 'Error' ? locale.dialogErrorTitle : title);
    messageBox.html(message);

    setTimeout(() => {
        openDialogDirect('dialog-error');
    }, 50);
};

/**
 * Validates the quick reply to a topic form submission.
 * 
 * @param {Object} event - The event object instance.
 * @param {Object} element - The element object instance.
 */
const validateReplyToTopic = (event, element) => {
    event.preventDefault();
    const editorId = $(element).data('id');
    const editor = textEditors[editorId];

    if (editor) {
        if (editor.isEmpty) {
            openErrorDialog(locale.textBodyMissing);
            return;
        }
    } else {
        return;
    }

    $(`#editor-${editorId}-field`).val(editor.getHTML());

    if (selectedTags[editorId] && selectedTags[editorId].length > 0) {
        $(`#tags-list-${editorId}`).val(JSON.stringify(selectedTags[editorId]));
    }

    element.submit();
};

/**
 * Validates the create new topic form.
 * 
 * @param {Object} event - The event object instance.
 * @param {Object} element - The element object instance.
 */
const validateCreateNewTopic = (event, element) => {
    event.preventDefault();
    const title = $('#title-input');
    const editorId = $(element).data('id');
    const editor = textEditors[editorId];

    if (title.val().length === 0) {
        openErrorDialog(locale.topicTitleMissing);
        return;
    }

    if (editor) {
        if (editor.isEmpty) {
            openErrorDialog(locale.textBodyMissing);
            return;
        }
    } else {
        return;
    }

    $(`#editor-${editorId}-field`).val(editor.getHTML());

    if (selectedTags[editorId] && selectedTags[editorId].length > 0) {
        $(`#tags-list-${editorId}`).val(JSON.stringify(selectedTags[editorId]));
    }

    element.submit();
};

/**
 * Adds the selected tag to the tags list.
 * 
 * @param {Object} element - The element object instance.
 */
const tagSuggestionsClick = (element) => {
    const box = $(element);
    const tag = box.data('tag');
    const id = box.data('id');
    const input = $(`#tag-input-${id}`);
    const suggestionsBox = $(`#tag-suggestions-${id}`);
    activeSuggestionsBox = suggestionsBox;

    if (!suggestionsBoxLegend.hasOwnProperty(id)) {
        suggestionsBoxLegend[id] = suggestionsBox;
    }

    addTag(tag, id);
    input.val('');
    suggestionsBox.hide();
};

/**
 * Checks for the comma or for input to trigger suggestions.
 * 
 * @param {Object} event - The event object instance.
 * @param {Object} element - The element object instance.
 */
const tagOnKeyUp = (event, element) => {
    const input = $(element);
    const id = $(element).data('id');
    const inputValue = input.val().trim();
    const suggestionsBox = $(`#tag-suggestions-${id}`);

    if (!suggestionsBoxLegend.hasOwnProperty(id)) {
        suggestionsBoxLegend[id] = suggestionsBox;
    }

    if (event.key === ',') {
        const tag = inputValue.replace(',', '').trim();
        if (tag.length > 0) addTag(tag, id);
        input.val('');
        activeSuggestionsBox = suggestionsBox;
        return;
     }

     fetchTags(inputValue, id)
        .then(() => {});
};

/**
 * Close the tag container if clicked out of it.
 * 
 * @param {Object} event - The event object instance.
 */
const closeTagContainer = (event) => {
    if (!$(event.target).closest('.tagInputContainer').length) {
        if (activeSuggestionsBox) {
            activeSuggestionsBox.hide();
            activeSuggestionsBox = null;
        }
    }
};

/**
 * Search for tags from a given input text.
 * 
 * @param {string} input - The input search query text.
 * @returns {Promise<Object>} A promise that resolves to the resulting tag data.
 */
const searchTags = (input) => {
    return new Promise((resolve, reject) => {
        const data = { input };

        ajaxGet('tags/search', response => {
            if (response.success) {
                resolve(response.data);
            } else {
                reject(new Error('Failed to fetch tags'));
            }
        }, data); 
    });
};

/**
 * Fetch tags and display them if matches are found.
 * 
 * @param {string} input - The input search query text.
 * @param {string} id - The identifier.
 */
const fetchTags = async (input, id) => {
    const tagSuggestions = $(`#tag-suggestions-${id}`);

    if (input.length === 0) {
        tagSuggestions.hide();
        return;
    }

    const tagData = await searchTags(input);

    if (tagData) {
        displayTagSuggestions(tagData.tags, id);
    }
};

/**
 * Display the tag suggestions to the user.
 * 
 * @param {Object[]} tags - An array of tags objects. 
 */
const displayTagSuggestions = (tags, id) => {
    const tagSuggestions = $(`#tag-suggestions-${id}`);

    tagSuggestions.empty();

    if (tags.length === 0) {
        tagSuggestions.hide();
        return;
    } 

    tags.forEach(tag => {
        tagSuggestions.append(`<li data-tag="${tag.title}" data-id="${id}" onclick="tagSuggestionsClick(this);">${tag.title}</li>`);
    });

    tagSuggestions.show();
};

/**
 * Adds the tag to the tags container.
 * 
 * @param {string} tag - The name of the tag.
 * @param {string} id - The identifier.
 */
const addTag = (tag, id) => {
    if (!selectedTags.hasOwnProperty(id)) {
        selectedTags[id] = [];
    }

    if (selectedTags[id].includes(tag)) return;
    selectedTags[id].push(tag);

    const selectedTagsContainer = $(`#selected-tags-${id}`);
    selectedTagsContainer.show();

    selectedTagsContainer.append(`
        <div class="tag">
            <div class="tagGrid">
                <div>${tag}</div>
                <div><a href="javascript:void(0);" data-tag="${tag}" data-id="${id}" onclick="removeTag(this, '${id}');"><i class="fa-solid fa-trash-can"></i></a></div>
            </div>
        </div>
    `);
};

/**
 * Removes a tag.
 * 
 * @param {Object} element - The element object instance.
 * @param {any} id - The identifier.
 */
const removeTag = (element, id) => {
    const tagText = $(element).data('tag');
    const tagElement = $(element).closest('.tag');

    if (selectedTags[id]) {
        selectedTags[id] = selectedTags[id].filter(t => t !== tagText);
    }

    tagElement.remove();

    if (!hasTagsInSelectedTagsElement(id)) {
        const selectedTagsContainer = $(`#selected-tags-${id}`);
        selectedTagsContainer.hide();
    }
};

/**
 * Check whether there are tags inside the tags element.
 * 
 * @param {any} id - The identifier.
 * @returns {boolean} True if tags are currently in the element, false if not. 
 */
const hasTagsInSelectedTagsElement = (id) => {
    const tagsElement = $(`#selected-tags-${id}`);
    if (!tagsElement.html()) return false;
    return tagsElement.html().length > 0;
};

/**
 * Toggles the poll expires checkbox.
 * 
 * @param {Object} element - The element object instance.
 */
const togglePollExpires = (element) => {
    const checkbox = $(`#${$(element).data('checkbox')}`);
    const dt = $(`#${$(element).data('dt')}`);

    if (checkbox.is(":checked")) {
        dt.fadeIn();
    } else {
        dt.fadeOut();
    }
};

/**
 * Initialize the poll var.
 */
const initializePoll = () => {
    poll = {
        expire: {
            enabled: false,
            expireDateTime: null,
        },
        allowReplies: true,
        questions: {
            1: {
                question: null,
                multipleChoice: false,
                options: {
                    1: null,
                    2: null,
                }
            }
        }
    };
};

/**
 * Adds the given question object to the poll var.
 * 
 * @param {number} number - The question number.
 * @param {Object} question - The question object.
 */
const addPollQuestion = (number, question) => {
    poll.questions[number] = question;
};

/**
 * Adds a poll option to the poll var.
 * 
 * @param {number} questionNumber - The question number.
 * @param {number} optionNumber - The option number.
 * @param {string} [value=null] - The value for the option.
 */
const addPollOption = (questionNumber, optionNumber, value = null) => {
    poll.questions[questionNumber].options[optionNumber] = value;
};

/**
 * Get the next poll option number for the given question number.
 * 
 * @param {number} questionNumber - The question number.
 * @returns {number} The next option number.
 */
const pollGetNextOptionNumber = (questionNumber) => {
    const numberColl = [];

    for (const key in poll.questions[questionNumber].options) {
        numberColl.push(key);
    }

    const numbers = numberColl.sort((a, b) => b - a);
    let number = numbers[0];
    number++;
    return number;
};

/**
 * Get the next question number.
 * 
 * @returns {number} The next question number.
 */
const pollGetNextQuestionNumber = () => {
    const numberColl = [];

    for (const key in poll.questions) {
        numberColl.push(parseInt(key, 10));
    }

    const numbers = numberColl.sort((a, b) => b - a);
    let number = numbers[0];
    number++;
    return number;
};

/**
 * Get the specified poll item.
 * 
 * @param {number} questionNumber - The question number.
 * @param {number} [optionNumber=null] - Optional option number.
 * @returns {Promise<Object>} A promise that resolves to the AJAX data object instance.
 */
const getPollItem = (questionNumber, optionNumber = null) => {
    const _questionNumber = parseInt(questionNumber, 10);
    const _optionNumber = optionNumber ? parseInt(optionNumber, 10) : null;
    const data = _questionNumber && _optionNumber ? { question: _questionNumber, option: _optionNumber } : { question: _questionNumber };

    return new Promise((resolve, reject) => {
        ajaxGet('poll/item', response => {
            if (response.success) {
                pollUpdateAttachLink();
                resolve(response.data);
            } else {
                reject(new Error('Failed to fetch poll item'));
            }
        }, data);
    });
};

/**
 * Adds a poll option.
 * 
 * @param {Object} element - The element object instance.
 */
const addNewPollOption = (element) => {
    const questionNumber = parseInt($(element).data('question'));
    const optionNumber = pollGetNextOptionNumber(questionNumber);
    const grid = $(`#question-${questionNumber}-options-grid`);

    getPollItem(questionNumber, optionNumber)
        .then(data => {
            addPollOption(questionNumber, optionNumber);
            grid.append(data.item);
            pollUpdateAttachLink();
        })
        .catch(error => openErrorDialog(error));
};

/**
 * Adds a new poll question.
 */
const addNewPollQuestion = () => {
    const questionNumber = pollGetNextQuestionNumber();
    const grid = $('#poll-questions-grid');

    getPollItem(questionNumber)
        .then(data => {
            addPollQuestion(questionNumber, {
                question: null,
                multipleChoice: false,
                options: {
                    1: null,
                    2: null,
                }
            });

            grid.append(data.item);
            pollUpdateAttachLink();
        })
        .catch(error => openErrorDialog(error));
};

/**
 * Triggered when the option field is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnOptionChange = (element) => {
    const questionNumber = parseInt($(element).data('question'), 10);
    const optionNumber = parseInt($(element).data('option'), 10);
    const optionValue = $(`#question-${questionNumber}-option-${optionNumber}-input`).val();
    const value = optionValue.length > 0 ? optionValue : null;
    console.log(value);
    poll.questions[questionNumber].options[optionNumber] = value;
    pollUpdateAttachLink();
};

/**
 * Triggered when the question field is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnQuestionChange = (element) => {
    const questionNumber = parseInt($(element).data('question'), 10);
    const questionValue = $(`#question-${questionNumber}-input`).val();
    const value = questionValue.length > 0 ? questionValue : null;
    poll.questions[questionNumber].question = value;
    pollUpdateAttachLink();
};

/**
 * Triggered when the multiple choice field is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnMcChange = (element) => {
    const questionNumber = parseInt($(element).data('question'), 10);
    const mcSelect = $(`#multiplechoice-question-${questionNumber}-mc`);
    poll.questions[questionNumber].multipleChoice = mcSelect.is(":checked");
    pollUpdateAttachLink();
};

/**
 * Triggered when the allow replies checkbox is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnAllowRepliesChange = (element) => {
    const allowReplies = $(element)
    poll.allowReplies = allowReplies.is(":checked");
    pollUpdateAttachLink();
};

/**
 * Triggered when the allow expire checkbox is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnAllowExpireChange = (element) => {
    const allowExpire = $(element);
    poll.expire.enabled = allowExpire.is(":checked");
    pollUpdateAttachLink();
};

/**
 * Triggered when the date/time field is changed.
 * 
 * @param {Object} element - The element object instance.
 */
const pollOnDateTimeChange = (element) => {
    const dateTime = $(element);

    if (poll.expire.enabled) {
        poll.expire.expireDateTime = dateTime.val();
    } else {
        poll.expire.expireDateTime = null;
    }

    pollUpdateAttachLink();
};

/**
 * Check whether there is a current poll configured.
 * 
 * @returns {boolean} True if there is a poll, false if not.
 */
const hasPoll = () => {
    const pollTemplate = {
        expire: {
            enabled: false,
            expireDateTime: null,
        },
        allowReplies: true,
        questions: {
            1: {
                question: null,
                multipleChoice: false,
                options: {
                    1: null,
                    2: null,
                }
            }
        }
    };

    return JSON.stringify(poll) !== JSON.stringify(pollTemplate);
};

/**
 * Updates the poll update attach link.
 */
const pollUpdateAttachLink = () => {
    const _poll = hasPoll();
    const removeLink = $(`#poll-attach-link`);
    const pollDataInput = $(`#poll-data`);

    if (_poll) {
        removeLink.show();
        pollDataInput.val(JSON.stringify(poll));
    } else {
        removeLink.hide();
        pollDataInput.val('');
    }
};

/**
 * Removes the poll attach.
 */
const pollRemoveAttach = () => {
    const questions = poll.questions;
    initializePoll();

    for (const key in questions) {
        if (parseInt(key, 10) !== 1) {
            $(`#question-${key}`).remove();
        }
    }

    pollUpdateAttachLink();
};

/**
 * Deletes a poll option.
 * 
 * @param {Object} element - The element object instance.
 */
const deletePollOption = (element) => {
    const questionNumber = parseInt($(element).data('question'), 10);
    const optionNumber = parseInt($(element).data('option'), 10);

    if (Object.keys(poll.questions[questionNumber].options).length > 2) {
        delete poll.questions[questionNumber].options[optionNumber];
        $(`#question-${questionNumber}-option-${optionNumber}`).remove();
    }

    pollUpdateAttachLink();
};

/**
 * Deletes a poll question.
 * 
 * @param {Object} element - The element object instance.
 */
const deletePollQuestion = (element) => {
    const questionNumber = parseInt($(element).data('question'), 10);

    if (Object.keys(poll.questions).length > 1) {
        delete poll.questions[questionNumber];
        $(`#question-${questionNumber}`).remove();
    }

    pollUpdateAttachLink();
};

/**
 * Casts a vote in the given poll.
 * 
 * @param {Object} element - The element instance.
 */
const pollCastVote = (element) => {
    const topicId = parseInt($(element).data('topicid'), 10);
    const poll = $(element).data('poll');
    const cast = $(element).data('cast') === 'true';
    const pollData = {};

    for (const questionKey in poll.questions) {
        const options = poll.questions[questionKey].options;

        if (!pollData.hasOwnProperty(questionKey)) {
            pollData[questionKey] = { options: {} };
        }

        for (const optionKey in options) {
            pollData[questionKey].options[optionKey] = $(`#question-${questionKey}-option-${optionKey}-input`).is(":checked");
        }
    }

    const data = {
        topicId,
        cast,
        pollData: JSON.stringify(pollData),
    };

    ajaxPost('poll/cast', data, response => {
        if (response.success) {
            $('#poll-container').html(response.data.poll);
        }
    });
};