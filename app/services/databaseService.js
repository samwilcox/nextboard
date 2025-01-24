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

const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');

/**
 * Initializes the database connection.
 * 
 * @returns {Promise} Resolves when the database connection is established.
 */
module.exports = () => {
    const db = DatabaseProviderFactory.create();

    return db.connect()
        .then(() => {
            console.log('Database connected.');
        });
};