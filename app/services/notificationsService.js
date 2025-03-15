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

const WebSocket = require('ws');

/**
 * Service that manages all the 'live' notifications.
 */
class NotificationsService {
    /**
     * Returns a new instance of NotificationsService.
     * 
     * @param {Object} server - The NextBoard application server. 
     */
    constructor(server) {
        this.clients = new Set();
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });
    }

    /**
     * Broadcast data to all connectec clients.
     * 
     * @param {Object} data - The data to broadcast to clients.
     */
    broadcast(data) {
        const message = JSON.stringify(data);

        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = NotificationsService;