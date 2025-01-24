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

const oracledb = require('oracledb');
const DatabaseInterface = require('../databaseInterface');

/**
 * Concrete implementation of the DatabaseInterface for Oracle SQL.
 */
class OracleProvider extends DatabaseInterface {
    /**
     * Creates an instance of OracleProvider.
     */
    constructor() {
        super();
        this.connection = null;
        this.tablePrefix = process.env.ORACLE_TABLE_PREFIX || '';
    }

    /**
     * Establishes a connection to the database server.
     */
    connect() {
        const configs = {
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING,
        };

        return new Promise((resolve, reject) => {
            oracledb.getConnection(configs)
                .then((connection) => {
                        this.connection = connection;
                        console.log('Connected to the Oracle SQL database server.');
                        resolve();
                })
                .catch((error) => {
                    console.error(`Failed to connect to the Oracle database server: ${error}`);
                    reject(error);
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

            this.connection.execute(sql.query, sql.values, { outFormat: oracledb.OUT_FORMAT_OBJECT })
                .then((result) => resolve(result.rows))
                .catch((error) => {
                    console.error(`Query Error: ${error}`);
                    reject(error);
                });
        });
    }

    /**
     * Disconnects from the database.
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.close()
                    .then(() => {
                        console.log('Disconnected from the Oracle SQL database server.');
                        resolve();
                    })
                    .catch((error) => {
                        console.error(`Failed to close the Oracle SQL database connection: ${error}`);
                        reject(error);
                    });
            } else {
                reject(new Error('No active connection to close.'));
            }
        });
    }
}

module.exports = OracleProvider;