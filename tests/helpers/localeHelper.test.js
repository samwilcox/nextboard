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
const MockLocaleHelper = require('../mocks/helpers/mockLocaleHelper');

testlabjs.beforeEach(() => {
    // Initialize the mock locale with sample data before each test
    MockLocaleHelper.initialize({
        greetings: {
            hello: 'Hello, ${name}!',
            morning: 'Good morning, ${name}!',
        },
        errors: {
            notFound: 'The ${item} was not found.',
            unauthorized: 'You are not authorized to access the ${resource}.',
        },
    });
});

testlabjs.test('getAll › should return all locale data', t => {
    const localeData = MockLocaleHelper.getAll();
    
    t.deepEqual(localeData, {
        greetings: {
            hello: 'Hello, ${name}!',
            morning: 'Good morning, ${name}!',
        },
        errors: {
            notFound: 'The ${item} was not found.',
            unauthorized: 'You are not authorized to access the ${resource}.',
        },
    }, 'Should return all locale data');
});

testlabjs.test('getCategory › should return the correct category', t => {
    const greetings = MockLocaleHelper.getCategory('greetings');
    
    t.deepEqual(greetings, {
        hello: 'Hello, ${name}!',
        morning: 'Good morning, ${name}!',
    }, 'Should return the correct category data');
});

testlabjs.test('get › should return the correct locale string for the category and string identifier', t => {
    const helloString = MockLocaleHelper.get('greetings', 'hello');
    
    t.is(helloString, 'Hello, ${name}!', 'Should return the correct locale string');
});

testlabjs.test('replace › should replace a single placeholder in a string', t => {
    const replacedString = MockLocaleHelper.replace('greetings', 'hello', 'name', 'Alice');
    
    t.is(replacedString, 'Hello, Alice!', 'Should replace the placeholder correctly');
});

testlabjs.test('replace › should handle undefined placeholders gracefully', t => {
    const replacedString = MockLocaleHelper.replace('greetings', 'hello', 'unknown', 'Alice');
    
    t.is(replacedString, 'Hello, ${name}!', 'Should not replace when placeholder is not found');
});

testlabjs.test('replaceAll › should replace multiple placeholders in a string', t => {
    const replacements = {
        name: 'Alice',
        item: 'book',
    };
    const replacedString = MockLocaleHelper.replaceAll('errors', 'notFound', replacements);
    
    t.is(replacedString, 'The book was not found.', 'Should replace all placeholders correctly');
});

testlabjs.test('replaceAll › should handle missing placeholders gracefully', t => {
    const replacements = {
        item: 'book',
        resource: 'page',
    };
    const replacedString = MockLocaleHelper.replaceAll('errors', 'unauthorized', replacements);
    
    t.is(replacedString, 'You are not authorized to access the page.', 'Should replace all placeholders correctly');
});

testlabjs.test('replaceAll › should handle an empty replacements object gracefully', t => {
    const replacedString = MockLocaleHelper.replaceAll('greetings', 'hello', {});
    
    t.is(replacedString, 'Hello, ${name}!', 'Should not replace anything when no replacements are provided');
});

testlabjs.test('replaceAll › should handle unknown placeholders gracefully', t => {
    const replacements = {
        unknown: 'value',
    };
    const replacedString = MockLocaleHelper.replaceAll('greetings', 'hello', replacements);
    
    t.is(replacedString, 'Hello, ${name}!', 'Should not replace any placeholders when no matching keys are provided');
});

testlabjs.test('replaceAll › should not modify string when no replacements exist', t => {
    const replacedString = MockLocaleHelper.replaceAll('errors', 'notFound', {});
    
    t.is(replacedString, 'The ${item} was not found.', 'Should not change the string when no replacements exist');
});