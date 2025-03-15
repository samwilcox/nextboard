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
const DataStoreService = require('../../app/services/dataStoreService');

testlabjs.test('datastoreService › set › should store a key-value pair in the datastore', t => {
    clearDataStore();
    DataStoreService.set('key1', 'value1');
    t.is(DataStoreService.get('key1'), 'value1', 'The value for the key should be stored correctly');
});

testlabjs.test('datastoreService › get › should return the value for an existing key', t => {
    clearDataStore();
    DataStoreService.set('key2', 'value2');
    const value = DataStoreService.get('key2');
    t.is(value, 'value2', 'Should return the correct value for the given key');
});

testlabjs.test('datastoreService › get › should return null for a non-existing key', t => {
    clearDataStore();
    const value = DataStoreService.get('nonExistentKey');
    t.is(value, null, 'Should return null for a key that does not exist');
});

testlabjs.test('datastoreService › exists › should return true if the key exists', t => {
    clearDataStore();
    DataStoreService.set('key3', 'value3');
    t.true(DataStoreService.exists('key3'), 'Should return true for an existing key');
});

testlabjs.test('datastoreService › exists › should return false if the key does not exist', t => {
    clearDataStore();
    t.false(DataStoreService.exists('nonExistentKey'), 'Should return false for a key that does not exist');
});

testlabjs.test('datastoreService › size › should return the correct size of the datastore', t => {
    clearDataStore();
    DataStoreService.set('key4', 'value4');
    DataStoreService.set('key5', 'value5');
    t.is(DataStoreService.size(), 2, 'Should return the correct number of stored items');
});

testlabjs.test('datastoreService › size › should return 0 when the datastore is empty', t => {
    clearDataStore();
    t.is(DataStoreService.size(), 0, 'Should return 0 for an empty datastore');
});

testlabjs.test('datastoreService › clear › should remove all items from the datastore', t => {
    clearDataStore();
    DataStoreService.set('key6', 'value6');
    DataStoreService.set('key7', 'value7');
    DataStoreService.clear();
    t.is(DataStoreService.size(), 0, 'The datastore should be empty after clearing');
});

testlabjs.test('datastoreService › getAll › should return a copy of all data in the datastore', t => {
    clearDataStore();
    DataStoreService.set('key8', 'value8');
    DataStoreService.set('key9', 'value9');
    const allData = DataStoreService.getAll();
    t.deepEqual(allData, { key8: 'value8', key9: 'value9' }, 'Should return all data as a copy');
});

testlabjs.test('datastoreService › getAll › should not affect the datastore when modified', t => {
    clearDataStore();
    DataStoreService.set('key10', 'value10');
    const allData = DataStoreService.getAll();
    allData.key10 = 'modifiedValue';
    t.is(DataStoreService.get('key10'), 'value10', 'Original datastore should not be affected by external modifications');
});

testlabjs.test('datastoreService › singleton › should always return the same instance', t => {
    clearDataStore();
    const anotherInstance = require('../../app/services/dataStoreService');
    t.is(DataStoreService, anotherInstance, 'Both references should point to the same instance');
});

testlabjs.test('datastoreService › set › should overwrite the value for an existing key', t => {
    clearDataStore();
    DataStoreService.set('key11', 'initialValue');
    DataStoreService.set('key11', 'updatedValue');
    t.is(DataStoreService.get('key11'), 'updatedValue', 'Should overwrite the value for the existing key');
});

/**
 * Helper that clears the datastore data.
 */
const clearDataStore = () => {
    DataStoreService.clear();
};