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

const MemberService = require('../services/memberService');
const LocaleHelper = require('./localeHelper');
const OutputHelper = require('./outputHelper');
const UtilHelper = require('./utilHelper');

/**
 * Helper for managing items across multiple pages.
 */
class PaginationHelper {
    /**
     * Generates pagination details based on the given total items, current page, and items per page.
     * 
     * @param {number} totalItems - Total number of items.
     * @param {number} [currentPage=1] - The current page number. 
     * @param {number} [itemsPerPage=20] - Number of items per page.
     * @returns {Object} Pagination details object. 
     */
    static paginate(totalItems, currentPage = 1, itemsPerPage = 20) {
        const maxPageLinks = MemberService.getMember().getPerPage().maxPageLinks;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        currentPage = Math.max(1, Math.min(currentPage, totalPages));

        const fromItem = (currentPage - 1) * itemsPerPage + 1;
        const toItem = Math.min(fromItem + itemsPerPage - 1, totalItems);
        const from = (currentPage - 1) * itemsPerPage;

        let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
        let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

        if (endPage - startPage + 1 < maxPageLinks) {
            startPage = Math.max(1, endPage - maxPageLinks + 1);
        }

        const pageLinks = [];

        for (let i = startPage; i <= endPage; i++) {
            pageLinks.push({
                page: i,
                active: i === currentPage
            });
        }

        return {
            totalItems,
            currentPage,
            itemsPerPage,
            totalPages,
            fromItem,
            toItem,
            from,
            hasFirst: currentPage > 1,
            hasPrevious: currentPage > 1,
            hasNext: currentPage < totalPages,
            hasLast: currentPage < totalPages,
            firstPage: 1,
            previousPage: currentPage > 1 ? currentPage - 1 : null,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
            lastPage:totalPages,
            pageLinks,
            includeLeftEllipsis: startPage > 1 ? true : false,
            includeRightEllipsis: endPage < totalPages ? true : false,
        };
    }

    /**
     * Build the pagination component with the given parameters.
     * 
     * @param {number} totalItems - Total number of items.
     * @param {number} [currentPage=1] - The current page number.
     * @param {number} [itemsPerPage=20] - Number of items per page.
     * @param {Object} [options={}] - Options for building the pagination component.
     * @param {string|null} [options.preUrl=null] - The URL to append to the beginning of the pagination URL portion.
     * @param {boolean} [options.marginTop=false] - True to include a margin above the component, false not to.
     * @param {boolean} [options.marginBottom=true] - True to include a margin below the component, false not to.
     * @param {string} [options.nameOfItem='item'] - The singular name of the item being paginated.
     * @param {string} [options.nameOfItems='items'] - The plural name of the item being paginated.
     * @returns {string} The pagination component source HTML.
     */
    static buildPaginationComponent(totalItems, currentPage = 1, itemsPerPage = 20, options = {}) {
        const {
            preUrl = null,
            marginTop = false,
            marginBottom = true,
            nameOfItem = LocaleHelper.get('paginationHelper', 'item'),
            nameOfItems = LocaleHelper.get('paginationHelper', 'items'),
        } = options;

        const pagination = this.paginate(totalItems, currentPage, itemsPerPage);
        const url = preUrl ? preUrl : UtilHelper.buildUrl();

        return OutputHelper.getPartial('paginationHelper', 'pagination', {
            pagination,
            url,
            marginTop,
            marginBottom,
            displaying: LocaleHelper.replaceAll('paginationHelper', 'displayingItems', {
                start: UtilHelper.formatNumber(pagination.fromItem),
                end: UtilHelper.formatNumber(pagination.toItem),
                total: UtilHelper.formatNumber(pagination.totalItems),
                itemName: totalItems === 1 ? nameOfItem : nameOfItems,
            }),
            pageOfPage: LocaleHelper.replaceAll('paginationHelper', `pageOfPage${pagination.totalPages === 1 ? 'Singular' : ''}`, {
                input: OutputHelper.getPartial('paginationHelper', 'pagination-num-input', {
                    value: pagination.currentPage,
                    min: 1,
                    max: pagination.totalPages,
                }),
                total: UtilHelper.formatNumber(pagination.totalPages),
            })
        });
    }
}

module.exports = PaginationHelper;