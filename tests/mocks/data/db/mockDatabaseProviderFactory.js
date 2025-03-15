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

const MockMysqlProvider = require('./providers/mockMysqlProvider');
const MockMssqlProvider = require('./providers/mockMssqlProvider');
const MockOracleProvider = require('./providers/mockOracleProvider');
const MockPostgresProvider = require('./providers/mockPostgresProvider');
const MockSqliteProvider = require('./providers/mockSqliteProvider');

/**
 * Class for creating "mock" DatabaseProviderFactory objects.
 */
class MockDatabaseProviderFactory {
    static instances = {};

    // Mock the create method
    static create() {
        const providerType = process.env.DATABASE_PROVIDER?.toLowerCase();

        if (!providerType) {
            throw new Error('DATABASE_PROVIDER environment variable is not set');
        }

        if (this.instances[providerType]) {
            return this.instances[providerType];
        }

        switch (providerType) {
            case 'mysql':
                this.instances[providerType] = new MockMysqlProvider();
                break;
                case 'postgres':
                case 'postgresql':
                case 'pg':
                    this.instances[providerType] = new MockPostgresProvider();
                break;
            case 'mssql':
                this.instances[providerType] = new MockMssqlProvider();
                break;
            case 'oraclesql':
            case 'oracle':
            case 'oracledb':
                this.instances[providerType] = new MockOracleProvider();
                break;
            case 'sqlite':
                this.instances[providerType] = new MockSqliteProvider();
                break;
            default:
                throw new Error(`Unsupported database type: ${providerType}`);
        }

        return this.instances[providerType];
    }

    static reset() {
        this.instances = {};
    }
}

module.exports = MockDatabaseProviderFactory;