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

const mysql = require('mysql2');
const DatabaseInterface = require('../databaseInterface');

/**
 * Concrete implementation of the DatabaseInterface for MySQL.
 */
class MysqlProvider extends DatabaseInterface {
    /**
     * Creates an instance of mysqlProvider.
     */
    constructor() {
        super();
        this.connection = null;
        this.tablePrefix = process.env.MYSQL_TABLE_PREFIX || '';
    }

    /**
     * Establishes a connection to the database server.
     */
    connect() {
        const configs = {
            host: process.env.MYSQL_HOSTNAME,
            port: parseInt(process.env.MYSQL_PORT, 10),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_NAME,
        };

        try {
            this.connection = mysql.createConnection(configs);
        } catch (error) {
            console.error(`Failed to connect to the database server: ${error}`);
        }

        return new Promise((resolve, reject) => {
            this.connection.connect((error) => {
                if (error) return reject(error);
                console.log('Connected to the MySQL database server.');
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

            if (!Array.isArray(sql.values)) {
                return reject(new Error('Values must be an array.'));
            }

            try {
                this.connection.query(sql.query, sql.values, (error, results) => {
                    if (error) {
                        console.error(`Query Error: ${error}`);
                        return reject(error);
                    }

                    resolve(results);
                });
            } catch (error) {
                console.error(`Unexpected Query Error: ${error}`);
                reject(error);
            }
        });
    }

    /**
     * Disconnects from the database.
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.end((error) => {
                    if (error) return reject(error);
                    resolve();
                });
            } else {
                reject(new Error('No active connection to close.'));
            }
        });
    }
}

module.exports = MysqlProvider;