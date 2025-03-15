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
 * Toggles the side menu.
 */
const toggleMenu = () => {
    const menu = $('#side-menu');
    const body = $('body');

    if (menu.is(":visible")) {
        menu.fadeOut();
        setTimeout(() => {
            body.css({ 'padding-left':'70px' });
        }, 400);
    } else {
        setTimeout(() => {
            menu.fadeIn();
        }, 120);
        body.css({ 'padding-left': '380px' });
    }
};

/**
 * Updates the menu category toggle flag.
 * 
 * @param {Object} element - The element object instance.
 */
const updateMenuCategoryToggle = (element) => {
    const category = $(element).data('category');

    if (!category) {
        console.error("Category data attribute is missing.");
        return;
    }

    const categoryElement = $(`#${category}-category`);
    const categoryItems = $(`#menu-${category}`);
    const categoryIcon = $(`#${category}-category i`);
    const isExpanded = categoryElement.hasClass('expanded');

    categoryItems.stop(true, true).slideToggle();
    categoryIcon.toggleClass(`${fontAwesome.menuCategoryExpanded} ${fontAwesome.menuCategoryCollapsed}`);
    categoryElement.toggleClass('expanded');

    const data = { category, toggle: !isExpanded };

    ajaxPost('menu/category/toggle', data, response => {
        if (!response.success) {
            console.error(response.data.message);
        }
    }, { adminCP: true });
};