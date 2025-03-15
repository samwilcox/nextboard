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

const http = require('http');
const NotificationsService = require('./notificationsService');
const DatabaseProviderFactory = require('../data/db/databaseProviderFactory');
const errorMiddleware = require('../middleware/errorMiddleware');

/**
 * Starts the HTTP server.
 * 
 * @param {Express} app - The express application object instance.
 */
module.exports = (app) => {
    const port = parseInt(process.env.SERVER_PORT, 10);
    const server = http.createServer(app);
    const notifications = new NotificationsService(server);

    app.use(errorMiddleware);

    server.listen(port, () => {
        console.log(`NextBoard server is running on port ${port}.`);
    });

    /**
     * Handle cleanup when NextBoard gets torn down.
     */
    const cleanUp = async () => {
        const db = DatabaseProviderFactory.create();
        console.log('Shutting down NextBoard gracefully...');

        try {
            server.close(() => {
                console.log('NextBoard server closed.');
                process.exit(1);
            });
        } catch (error) {
            console.error(`Error shutting down NextBoard server: ${error}`);
            process.exit(1);
        } finally {
            await db.disconnect();
        }
    };

    process.on('SIGINT', cleanUp);
    process.on('SIGTERM', cleanUp);
};