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

const mssql = require('mssql');
const DatabaseInterface = require('../databaseInterface');

/**
 * Concrete implementation of the DatabaseInterface for Microsoft SQL Server.
 */
class MssqlProvider extends DatabaseInterface {
    /**
     * Creates an instance of MssqlProvider.
     */
    constructor() {
        super();
        this.pool = null;
        this.tablePrefix = process.env.MSSQL_TABLE_PREFIX || '';
    }

    /**
     * Establishes a connection to the database server.
     */
    connect() {
        const configs = {
            server: process.env.MYSQL_HOSTNAME,
            port: parseInt(process.env.MYSQL_PORT, 10),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_NAME,
            options: {
                encrypt: process.env.MSSQL_USE_ENCRYPTION === 'true',
                trustServerCertificates: process.env.MSSQL_SELF_SIGNED_CERTIFICATES === 'true',
            },
        };

        return new Promise((resolve, reject) => {
            mssql.connect(configs)
                .then((pool) => {
                    this.pool = pool;
                    console.log('Connected to the Microsoft SQL Server.');
                    resolve();
                })
                .catch((error) => {
                    console.error(`Failed to connect to the Microsoft SQL Server: ${error}`);
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

            try {
                const request = this.pool.request();
                
                sql.values.forEach((value, index) => {
                    request.input(`params${index + 1}`, value);
                });

                request.query(sql.query)
                    .then((result) => resolve(result.recordset))
                    .catch((error) => {
                        console.error(`Query Error: ${error}`);
                        reject(error);
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
            if (this.pool) {
                this.pool.close()
                    .then(() => resolve())
                    .catch((error) => reject(error));
            } else {
                reject(new Error('No active connection to close.'));
            }
        });
    }
}

module.exports = MssqlProvider;