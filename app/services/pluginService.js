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

const Settings = require('../settings');
const path = require('path');
const fs = require('fs');

/**
 * PluginService loads plugins and manages plugins.
 */
class PluginService {
    static instance = null;

    /**
     * Returns a new instance of PluginService.
     */
    constructor() {
        this.plugins = {};
        this.hooks = {};
    }

    /**
     * Get the singleton instance of PluginService.
     * 
     * @returns {PluginService} The singleton instance of PluginService.
     */
    static getInstance() {
        if (!PluginService.instance) {
            PluginService.instance = new PluginService();
        }

        return PluginService.instance;
    }

    /**
     * Loads all the current plugins.
     */
    loadPlugins() {
        const basePath = path.join(__dirname, '..', '');
        const pluginFolderName = Settings.get('pluginsDir');

        if (!pluginFolderName) {
            throw new Error(`The 'pluginsDir' settings is missing or invalid in the configurations`);
        }

        const pluginPath = path.join(basePath, pluginFolderName);

        if (!fs.existsSync(pluginPath)) {
            throw new Error(`Plguin directory does not exist: ${pluginPath}`);
        }

        const pluginFolders = fs.readdirSync(pluginPath, { writeFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        pluginFolders.forEach(folder => {
            const currentPluginPath = path.join(pluginPath, folder);
            const pluginConfigPath = path.join(currentPluginPath, 'plugin.json');
            const pluginIndexPath = path.join(currentPluginPath, 'index.js');

            if (fs.existsSync(pluginConfigPath) && fs.existsSync(pluginIndexPath)) {
                const pluginConfig = require(pluginConfigPath);
                const pluginMain = require(pluginIndexPath);

                this.plugins[pluginConfig.name] = {
                    config: pluginConfig,
                    main: pluginMain,
                };

                (pluginConfig.hooks || []).forEach(hook => {
                    if (!this.hooks[hook]) {
                        this.hooks[hook] = [];
                    }

                    this.hooks[hook].push([pluginMain[hook]]);
                });

                console.log(`[PluginLoader] loaded plugin: ${pluginConfig.name}`);
            } else {
                console.warn(`[PluginLoader] Skipped plugin in ${folder}: Missing plugin.json`);
            }
        });
    }

    /**
     * Trigger a hook and pass argumetns to plugin handlers.
     * 
     * @param {string} hook - The name of the hook to trigger.
     * @param  {...any} args - Arguments to pass to the hook handlers.
     */
    triggerHook(hook, ...args) {
        if (this.hooks[hook]) {
            this.hooks[hook].forEach(handler => {
                try {
                    handler(...args);
                } catch (error) {
                    console.error(`[PluginLoader] error in hook: "${hook}": ${error}`);
                }
            });
        }
    }

    /**
     * Get information about loaded plugins.
     * 
     * @returns {Object[]} An array of loaded plugin metadata.
     */
    getLoadedPlugins() {
        return Object.values(this.plugins).map(plugin => plugin.config);
    }
}

module.exports = PluginService.getInstance();