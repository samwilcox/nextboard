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

const MysqlProvider = require('./providers/mysqlProvider');
const PostgresProvider = require('./providers/postgresProvider');
const MssqlProvider = require('./providers/mssqlProvider');
const OracleProvider = require('./providers/oracleProvider');
const SqliteProvider = require('./providers/sqliteProvider');

/**
 * Factory class for creating instances of different database providers.
 * Based on the provider database type, it returns the corresponding database provider.
 */
class DatabaseProviderFactory {
    static instance = null;

    /**
     * Creates an instance of a database provider based on the set type.
     * 
     * @returns {DatabaseInterface} An instance of the appropriate database provider class.
     * @throws {Error} If the specified database type is not supported.
     */
    static create() {
        if (DatabaseProviderFactory.instance !== null) {
            return DatabaseProviderFactory.instance;
        }

        switch (process.env.DATABASE_PROVIDER.toLowerCase()) {
            case 'mysql':
                DatabaseProviderFactory.instance = new MysqlProvider();
                break;
            case 'postsgre':
            case 'postgresql':
            case 'pg':
                DatabaseProviderFactory.instance = new PostgresProvider();
                break;
            case 'mssql':
                DatabaseProviderFactory.instance = new MssqlProvider();
                break;
            case 'oraclesql':
            case 'oracle':
            case 'oracledb':
                DatabaseProviderFactory.instance = new OracleProvider();
                break;
            case 'sqlite':
                DatabaseProviderFactory.instance = new SqliteProvider();
                break;
            default:
                throw new Error(`Unsupported database type" ${process.env.DATABASE_PROVIDER}`);
        }

        return DatabaseProviderFactory.instance;
    }
}

module.exports = DatabaseProviderFactory;