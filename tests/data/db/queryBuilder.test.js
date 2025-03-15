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
const QueryBuilder = require('../../../app/data/db/queryBuilder');

testlabjs.test('select › should create a SELECT query with specified columns', t => {
    const qb = new QueryBuilder();
    qb.select(['id', 'name']).from('users');
    const { query, values } = qb.build();

    t.is(query, 'SELECT id, name FROM users');
    t.deepEqual(values, []);
});

testlabjs.test('select › should create a SELECT * query when no columns are specified', t => {
    const qb = new QueryBuilder();
    qb.select().from('users');
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users');
    t.deepEqual(values, []);
});

testlabjs.test('distinct › should add DISTINCT to the query', t => {
    const qb = new QueryBuilder();
    qb.select().distinct().from('users');
    const { query, values } = qb.build();

    t.is(query, 'SELECT DISTINCT * FROM users');
    t.deepEqual(values, []);
});

testlabjs.test('from › should specify the table to select from', t => {
    const qb = new QueryBuilder();
    qb.select().from('users');
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users');
    t.deepEqual(values, []);
});

testlabjs.test('join › should add a JOIN clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').join('INNER', 'profile', 'users.id = profile.user_id');
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users INNER JOIN profile ON users.id = profile.user_id');
    t.deepEqual(values, []);
});

testlabjs.test('where › should add a WHERE clause to the query with values', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').where('id = ?', 1);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE id = ?');
    t.deepEqual(values, [1]);
});

testlabjs.test('andWhere › should add an AND condition to the WHERE clause', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').where('status = ?', 'active').andWhere('age > ?', 21);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE status = ? AND age > ?');
    t.deepEqual(values, ['active', 21]);
});

testlabjs.test('orWhere › should add an OR condition to the WHERE clause', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').where('status = ?', 'active').orWhere('age > ?', 21);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE status = ? OR age > ?');
    t.deepEqual(values, ['active', 21]);
});

testlabjs.test('in › should add an IN condition to the WHERE clause with multiple values', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').onlyWhere().in('status', ['active', 'inactive']);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE status IN (?, ?)');
    t.deepEqual(values, ['active', 'inactive']);
});

testlabjs.test('between › should add a BETWEEN condition to the WHERE clause', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').onlyWhere().between('createdAt', ['2020-01-01', '2020-12-31']);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE createdAt BETWEEN ? and ?');
    t.deepEqual(values, ['2020-01-01', '2020-12-31']);
});

testlabjs.test('groupBy › should add a GROUP BY clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').groupBy(['status', 'age']);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users GROUP BY status, age');
    t.deepEqual(values, []);
});

testlabjs.test('having › should add a HAVING clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').groupBy('status').having('COUNT(*) > ?', 10);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users GROUP BY status HAVING COUNT(*) > ?');
    t.deepEqual(values, [10]);
});

testlabjs.test('orderBy › should add an ORDER BY clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').orderBy('createdAt', 'DESC');
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users ORDER BY createdAt DESC');
    t.deepEqual(values, []);
});

testlabjs.test('limit › should add a LIMIT clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').limit(10);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users LIMIT 10');
    t.deepEqual(values, [10]);
});

testlabjs.test('offset › should add an OFFSET clause to the query', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').offset(5);
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users OFFSET ?');
    t.deepEqual(values, [5]);
});

testlabjs.test('insertInto › should create an INSERT INTO query with values', t => {
    const qb = new QueryBuilder();
    qb.insertInto('users', ['name', 'email'], ['John Doe', 'john@example.com']);
    const { query, values } = qb.build();

    t.is(query, 'INSERT INTO users (name, email) VALUES (?, ?)');
    t.deepEqual(values, ['John Doe', 'john@example.com']);
});

testlabjs.test('update › should start an UPDATE query with SET values', t => {
    const qb = new QueryBuilder();
    qb.update('users').set(['name', 'email'], ['John Doe', 'john@example.com']);
    const { query, values } = qb.build();

    t.is(query, 'UPDATE users SET name = ?, email = ?');
    t.deepEqual(values, ['John Doe', 'john@example.com']);
});

testlabjs.test('deleteFrom › should create a DELETE query from the specified table', t => {
    const qb = new QueryBuilder();
    qb.deleteFrom('users').where('id = ?', 1);
    const { query, values } = qb.build();

    t.is(query, 'DELETE FROM users WHERE id = ?');
    t.deepEqual(values, [1]);
});

testlabjs.test('onDuplicateKey › should add an ON DUPLICATE KEY UPDATE clause', t => {
    const qb = new QueryBuilder();
    qb.insertInto('users', ['name', 'email'], ['John Doe', 'john@example.com'])
        .onDuplicateKey(['name', 'email']);
    const { query, values } = qb.build();

    t.is(query, 'INSERT INTO users (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);');
    t.deepEqual(values, ['John Doe', 'john@example.com']);
});

testlabjs.test('build › should return the final query string and values array', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').where('status = ?', 'active');
    const { query, values } = qb.build();

    t.is(query, 'SELECT * FROM users WHERE status = ?');
    t.deepEqual(values, ['active']);
});

testlabjs.test('clear › should reset the query string and values array', t => {
    const qb = new QueryBuilder();
    qb.select().from('users').where('status = ?', 'active').clear();
    const { query, values } = qb.build();

    t.is(query, '');
    t.deepEqual(values, []);
});