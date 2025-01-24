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

const { Pool } = require('pg');
const DatabaseInterface = require('../databaseInterface');

/**
 * Concrete implementation of the DatabaseInterface for PostgreSQL.
 */
class PostgresProvider extends DatabaseInterface {
    /**
     * Creates an instance of PostgresProvider.
     */
    constructor() {
        super();
        this.pool = null;
        this.tablePrefix = process.env.POSTGRES_TABLE_PREFIX || '';
    }

    /**
     * Establishes a connection to the database server.
     */
    connect() {
        const configs = {
            host: process.env.POSTGRES_HOSTNAME,
            port: parseInt(process.env.POSTGRES_PORT, 10),
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE_NAME,
        };

        try {
            this.pool = new Pool(configs);
            console.log('Connected to the PostgreSQL database server.');
        } catch (error) {
            console.error(`Failed to create a PostgreSQL connection pool: ${error}`);
        }

        return Promise.resolve();
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
                this.pool.query(sql.query, sql.values)
                    .then((result) => resolve(result.rows))
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
                this.pool.end()
                    .then(() => resolve())
                    .catch((error) => reject(error));
            } else {
                reject(new Error('No active connection pool to close.'));
            }
        });
    }
}

module.exports = PostgresProvider;