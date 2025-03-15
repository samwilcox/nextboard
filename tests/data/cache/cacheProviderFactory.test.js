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

require('dotenv').config();
const testlabjs = require('testlab.js');
const MockCacheProviderFactory = require('../../mocks/data/cache/mockCacheProviderFactory');
const MockNocacheProvider = require('../../mocks/data/cache/providers/mockNocacheProvider');

testlabjs.beforeEach(() => {
    process.env.CACHE_ENABLED = 'false';
    process.env.CACHE_METHOD = '';
    MockCacheProviderFactory.reset();
});

testlabjs.test('create › should create a Mock NoCache Provider when caching is disabled', t => {
    process.env.CACHE_ENABLED = 'false'; // Disable caching
    const provider = MockCacheProviderFactory.create();

    t.is(provider.name, 'Mock NoCache Provider', 'Should return a Mock NoCache Provider');
});

testlabjs.test('create › should create a Mock NoCache Provider when caching is enabled but no specific method is set', t => {
    process.env.CACHE_ENABLED = 'true'; // Enable caching
    process.env.CACHE_METHOD = ''; // No specific method
    const provider = MockCacheProviderFactory.create();

    t.is(provider.name, 'Mock NoCache Provider', 'Should return a Mock NoCache Provider');
});

testlabjs.test('create › should create a Mock NoCache Provider when CACHE_METHOD is set to an unsupported value', t => {
    process.env.CACHE_ENABLED = 'true'; // Enable caching
    process.env.CACHE_METHOD = 'unsupported'; // Unsupported caching method
    const provider = MockCacheProviderFactory.create();

    t.is(provider.name, 'Mock NoCache Provider', 'Should return a Mock NoCache Provider');
});

testlabjs.test('create › should return the same instance for multiple calls with the same CACHE_METHOD', t => {
    process.env.CACHE_ENABLED = 'true'; // Enable caching
    process.env.CACHE_METHOD = 'default'; // Default method
    const firstInstance = MockCacheProviderFactory.create();
    const secondInstance = MockCacheProviderFactory.create();

    t.is(firstInstance, secondInstance, 'Should return the same instance for the same CACHE_METHOD');
});

testlabjs.test('reset › should clear the cached instances (Cache)', t => {
    process.env.CACHE_ENABLED = 'true'; // Enable caching
    process.env.CACHE_METHOD = 'default'; // Default method
    const firstInstance = MockCacheProviderFactory.create();

    MockCacheProviderFactory.reset(); // Reset the cache

    const secondInstance = MockCacheProviderFactory.create();

    t.not(firstInstance, secondInstance, 'Should create a new instance after reset');
});

testlabjs.test('MockNocacheProvider › should have the correct name property', t => {
    const provider = new MockNocacheProvider();
    t.is(provider.name, 'Mock NoCache Provider', 'Should have the correct name');
});