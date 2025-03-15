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
const UtilHelper = require('../../app/helpers/utilHelper');

testlabjs.test('getIndexInArr › should return the correct index for a matching value', t => {
    const arr = [1, 2, 3, 4, 5];
    const needle = 3;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 2);  // Index starts from 0, so 3 is at index 2
});

testlabjs.test('getIndexInArr › should return undefined if the value is not in the array', t => {
    const arr = [1, 2, 3, 4, 5];
    const needle = 6;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, undefined);  // 6 is not in the array, should return undefined
});

testlabjs.test('getIndexInArr › should handle arrays with non-numeric values', t => {
    const arr = ['apple', 'banana', 'cherry'];
    const needle = 'banana';

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 1);  // 'banana' is at index 1
});

testlabjs.test('getIndexInArr › should return undefined for an empty array', t => {
    const arr = [];
    const needle = 'any';

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, undefined);  // Empty array, no value to find
});

testlabjs.test('getIndexInArr › should return 0 for the first element', t => {
    const arr = [1, 2, 3];
    const needle = 1;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 0);  // First element is at index 0
});

testlabjs.test('getIndexInArr › should return the correct index for the last element', t => {
    const arr = [1, 2, 3];
    const needle = 3;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 2);  // Last element is at index 2
});

testlabjs.test('getIndexInArr › should return undefined when searching for `undefined` in an array', t => {
    const arr = [1, 2, 3];
    const needle = undefined;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, undefined);  // `undefined` is not in the array, should return undefined
});

testlabjs.test('getIndexInArr › should return correct index for `null` in an array', t => {
    const arr = [1, 2, null, 4];
    const needle = null;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 2);  // `null` is at index 2
});

testlabjs.test('getIndexInArr › should return correct index for a boolean value in an array', t => {
    const arr = [true, false, true];
    const needle = false;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 1);  // `false` is at index 1
});

testlabjs.test('getIndexInArr › should handle an array with only one element', t => {
    const arr = [10];
    const needle = 10;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 0);  // Single element array, index is 0
});

testlabjs.test('getIndexInArr › should handle arrays with duplicate values', t => {
    const arr = [5, 3, 3, 7, 9];
    const needle = 3;

    const index = UtilHelper.getIndexInArr(arr, needle);

    t.is(index, 1);  // First occurrence of 3 is at index 1
});

testlabjs.test('addIdAndNameToUrl › should return correct slugified URL when given a numeric ID and valid name', t => {
    const id = 123;
    const name = 'Hello World';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '123/hello-world');  // Check that the result matches the expected slugified URL
});

testlabjs.test('addIdAndNameToUrl › should return correct slugified URL when given a string ID and valid name', t => {
    const id = 'abc';
    const name = 'Test Slug';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, 'abc/test-slug');  // Ensure string ID is handled correctly
});

testlabjs.test('addIdAndNameToUrl › should handle names with special characters by replacing them with hyphens', t => {
    const id = 456;
    const name = 'Special! @Char$';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '456/special-char');  // Ensure special characters are replaced with hyphens
});

testlabjs.test('addIdAndNameToUrl › should handle names with spaces by replacing them with hyphens', t => {
    const id = 789;
    const name = 'Test with spaces';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '789/test-with-spaces');  // Ensure spaces are replaced with hyphens
});

testlabjs.test('addIdAndNameToUrl › should handle empty name by returning only the ID in the URL', t => {
    const id = 123;
    const name = '';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '123/');  // Ensure empty name results in just the ID in the URL
});

testlabjs.test('addIdAndNameToUrl › should slugify names with uppercase letters', t => {
    const id = 987;
    const name = 'UpperCase Test';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '987/uppercase-test');  // Ensure uppercase letters are converted to lowercase
});

testlabjs.test('addIdAndNameToUrl › should handle names with multiple spaces correctly', t => {
    const id = 654;
    const name = 'Multiple   spaces here';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '654/multiple-spaces-here');  // Ensure multiple spaces are replaced with a single hyphen
});

testlabjs.test('addIdAndNameToUrl › should handle names with numbers correctly', t => {
    const id = 321;
    const name = 'Test 123 name';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '321/test-123-name');  // Ensure numbers are correctly included in the URL
});

testlabjs.test('addIdAndNameToUrl › should return correct slug for very long names', t => {
    const id = 555;
    const name = 'A very long name that exceeds the normal length of a typical URL slug and should still be slugified properly for URLs';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '555/a-very-long-name-that-exceeds-the-normal-length-of-a-typical-url-slug-and-should-still-be-slugified-properly-for-urls');  // Ensure long names are slugified properly
});

testlabjs.test('addIdAndNameToUrl › should return correct slugified URL for name with mixed special characters', t => {
    const id = 101;
    const name = 'Hello! World, this is @Test';

    const result = UtilHelper.addIdAndNameToUrl(id, name);

    t.is(result, '101/hello-world-this-is-test');  // Ensure mixed special characters are handled
});