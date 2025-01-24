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

/**
 * The interface contract for Database Providers.
 */
class DatabaseInterface {
    /**
     * Establishes a connection to the database server.
     * This method MUST be implemented by a concrete databasa provider class.
     * 
     * @throws {Error} If the method is not implemented by the provider class.
     */
    connect() {
        throw new Error('connect() method must be implemented');
    }

    /**
     * Executes a query on the database.
     * This method MUST be implemented by a concrete databasa provider class.
     * 
     * @param {Object} sql - The SQL query object. ('query' and 'values').
     * @returns {Promise} A promise that resolves with the result of the query.
     * @throws {Error} If the method is not implemented by the provider class.
     */
    query(sql) {
        throw new Error('query() method must be implemented');
    }

    /**
     * Disconnects from the database.
     * This method MUST be implemented by a concrete databasa provider class.
     * 
     * @throws {Error} If the method is not implemented by the provider class.
     */
    disconnect() {
        throw new Error('disconnect() method must be implemented');
    }
}

module.exports = DatabaseInterface;