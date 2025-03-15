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

const testlabjs = require('testlab.js');
const PaginationHelper = require('../../app/helpers/paginationHelper');
const sinon = require('sinon');
const MemberService = require('../../app/services/memberService');

testlabjs.test('paginate › should return correct total pages', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.is(result.totalPages, 10);
});

testlabjs.test('paginate › should default to page 1 if currentPage is less than 1', t => {
    createStub();
    const result = PaginationHelper.paginate(100, -5, 10);
    unstub();
    t.is(result.currentPage, 1);
});

testlabjs.test('paginate › should default to last page if currentPage is greater than totalPages', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 20, 10);
    unstub();
    t.is(result.currentPage, 10);
});

testlabjs.test('paginate › should calculate from and to items correctly', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 2, 10);
    unstub();
    t.is(result.fromItem, 11);
    t.is(result.toItem, 20);
});

testlabjs.test('paginate › should return from as SQL offset', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 3, 10);
    unstub();
    t.is(result.from, 20); // 3rd page starts at offset 20
});

testlabjs.test('paginate › should determine if first page is available', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 2, 10);
    unstub();
    t.true(result.hasFirst);
});

testlabjs.test('paginate › should determine if previous page is available', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 2, 10);
    unstub();
    t.true(result.hasPrevious);
});

testlabjs.test('paginate › should determine if next page is available', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.true(result.hasNext);
});

testlabjs.test('paginate › should determine if last page is available', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.true(result.hasLast);
});

testlabjs.test('paginate › should return null for previousPage when on first page', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.is(result.previousPage, null);
});

testlabjs.test('paginate › should return correct nextPage value', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.is(result.nextPage, 2);
});

testlabjs.test('paginate › should return correct lastPage value', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 1, 10);
    unstub();
    t.is(result.lastPage, 10);
});

testlabjs.test('paginate › should generate correct number of page links', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 5, 10);
    unstub();
    t.is(result.pageLinks.length, 5); // Limited to maxPageLinks (5)
});

testlabjs.test('paginate › should correctly set active page in pageLinks', t => {
    createStub();
    const result = PaginationHelper.paginate(100, 3, 10);
    unstub();
    t.true(result.pageLinks.some(link => link.page === 3 && link.active));
});

testlabjs.test('paginate › should return empty pageLinks when no pages exist', t => {
    createStub();
    const result = PaginationHelper.paginate(0, 1, 10);
    unstub();
    t.deepEqual(result.pageLinks, []);
});

testlabjs.test('paginate › should return correct lastPage when totalItems is 0', t => {
    createStub();
    const result = PaginationHelper.paginate(0, 1, 10);
    unstub();
    t.is(result.totalPages, 0);
});

const createStub = () => {
    sinon.stub(MemberService, 'getMember').returns({
        getPerPage: () => ({ maxPageLinks: 5 })
    });
};

const unstub = () => {
    sinon.restore();
};