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

const sqlite3 = require('sqlite3');
const DatabaseInterface = require('../databaseInterface');

/**
 * Concrete implementation of the DatabaseInterface for SQLite.
 */
class SqliteProvider extends DatabaseInterface {
    /**
     * Creates an instance of SqliteProvider.
     */
    constructor() {
        super();
        this.db = null;
        this.tablePrefix = process.env.SQLITE_TABLE_PREFIX || '';
    }

    /**
     * Establishes a connection to the SQLite database file.
     */
    connect() {
        const dbPath = process.env.SQLITE_DATABASE_PATH || './database.sqlite';

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
                if (error) {
                    console.error(`Failed to connect to the SQLite database: ${error}`);
                    return reject(error);
                }

                console.log('Connected to the SQLite database.');
                resolve();
            });
        });
    }

    /**
     * Executes a query on the database.
     * 
     * @param {Object} sql - The SQL query object. ('query' and 'values').
     * @returns {Promise} A promise that resolves with the result of the query.
     */
    query(sql) {
        return new Promise((resolve, reject) => {
            if (!sql.query || typeof sql.query !== 'string') {
                return reject(new Error('Invalid SQL query string.'));
            }

            const isSelectQuery = sql.query.trim().toUpperCase().startsWith('SELECT');

            if (isSelectQuery) {
                this.db.all(sql.query, sql.values || [], (error, rows) => {
                    if (error) {
                        console.error(`Query Error: ${error}`);
                        return reject(error);
                    }

                    resolve();
                });
            } else {
                this.db.run(sql.query, sql.values || [], (error) => {
                    if (error) {
                        console.error(`Query Error: ${error}`);
                        return reject(error);
                    }

                    resolve();
                });
            }
        });
    }

    /**
     * Disconnects from the database.
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((error) => {
                    if (error) {
                        console.error(`Failed to close the SQLite database connection: ${error}`);
                        return reject(error);
                    }

                    console.log('Disconnected from the SQLite database.');
                    resolve();
                });
            } else {
                reject(new Error('No active connection to close.'));
            }
        });
    }
}

module.exports = SqliteProvider;