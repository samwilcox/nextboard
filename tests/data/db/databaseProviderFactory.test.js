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
const process = require('process');
const MockDatabaseProviderFactory = require('../../mocks/data/db/mockDatabaseProviderFactory');

testlabjs.beforeEach(() => {
    process.env.DATABASE_PROVIDER = '';
    MockDatabaseProviderFactory.reset();
});

testlabjs.test('create › should create a Mock MySQL Provider when MYSQL is set', t => {
    process.env.DATABASE_PROVIDER = 'mysql';
    const provider = MockDatabaseProviderFactory.create();

    t.is(provider.constructor.name, 'MockMysqlProvider', 'Should return a MockMysqlProvider');
});

testlabjs.test('create › should create a Mock Postgres Provider when POSTGRESQL is set', t => {
    process.env.DATABASE_PROVIDER = 'postgresql';
    const provider = MockDatabaseProviderFactory.create();

    t.is(provider.constructor.name, 'MockPostgresProvider', 'Should return a MockPostgresProvider');
});

testlabjs.test('create › should create a Mock SQLite Provider when SQLITE is set', t => {
    process.env.DATABASE_PROVIDER = 'sqlite';
    const provider = MockDatabaseProviderFactory.create();

    t.is(provider.constructor.name, 'MockSqliteProvider', 'Should return a MockSqliteProvider');
});

testlabjs.test('create › should throw an error for unsupported database provider', t => {
    process.env.DATABASE_PROVIDER = 'unsupportedDB';

    const error = t.throws(() => {
        MockDatabaseProviderFactory.create();
    }, { instanceOf: Error });

    t.is(error.message, 'Unsupported database type: unsupporteddb', 'Should throw error for unsupported database type');
});

testlabjs.test('create › should return the same instance for the same provider type', t => {
    process.env.DATABASE_PROVIDER = 'mysql';
    const firstInstance = MockDatabaseProviderFactory.create();
    const secondInstance = MockDatabaseProviderFactory.create();

    t.is(firstInstance, secondInstance, 'Should return the same instance for subsequent calls');
});

testlabjs.test('reset › should clear the cached instances (DB)', t => {
    process.env.DATABASE_PROVIDER = 'mysql';
    const firstInstance = MockDatabaseProviderFactory.create();

    MockDatabaseProviderFactory.reset();

    const secondInstance = MockDatabaseProviderFactory.create();

    t.not(firstInstance, secondInstance, 'Should return different instances after reset');
});