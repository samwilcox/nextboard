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

const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const FileHelper = require('../../helpers/fileHelper');
const { version } = require('../../../package.json');
const CacheProviderFactory = require('../../data/cache/cacheProviderFactory');
const MemberService = require('../../services/memberService');
const DatabaseProviderFactory = require('../../data/db/databaseProviderFactory');
const QueryBuilder = require('../../data/db/queryBuilder');
const DateTimeHelper = require('../../helpers/dateTimeHelper');

/**
 * UtilHelper provides helpers for the most commonly used helpers for the AdminCP.
 */
class UtilHelper {
    /**
     * Get all the details regarding the system that NextBoard is installed on.
     * 
     * @param {Object} req - The request object from Express.
     * @returns {Object} An object containing all the system details.
     */
    static getSystemDetails(req) {
        const systemInfo = {};
        const freePercentage = ((os.freemem() / os.totalmem()) * 100).toFixed(2);

        systemInfo.os = {
            type: os.type(),
            platform: os.platform(),
            release: os.release(),
            version: this.getOSVersion(),
            arch: os.arch(),
            totalMemory: {
                raw: os.totalmem(),
                formatted: FileHelper.formatFileSize(os.totalmem()),
                percentage: (100 - freePercentage).toFixed(2),
            },
            freeMemory: {
                raw: os.freemem(),
                formatted: FileHelper.formatFileSize(os.freemem()),
                percentage: freePercentage,
            },
            hostname: os.hostname(),
            networkInterfaces: os.networkInterfaces(),
            homeDir: os.homedir(),
            uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
        };

        systemInfo.node = {
            version: process.version,
            pid: process.pid,
            memoryUsage: FileHelper.formatFileSize(process.memoryUsage().rss),
            uptime: `${(process.uptime() / 60).toFixed(2)} minutes`,
        };

        systemInfo.proxy = {};

        const headers = req.headers;

        const isNginx = headers['x-nginx-proxy'] !== undefined;
        const isApache = headers['via'] && headers['via'].includes('Apache');
        const isCloudflare = headers['cf-ray'] !== undefined;

        let platform = 'Direct (No proxy detected)';

        if (isNginx) platform = 'Nginx';
        if (isApache) platform = 'Apache';
        if (isCloudflare) platform = 'Cloudflare';

        systemInfo.proxy = {
            usingProxy: platform === 'Nginx' || platform === 'Apache' || platform === 'Cloudflare',
            platform,
        };

        systemInfo.cpu = {
            model: os.cpus()[0].model.trim(),
            cores: os.cpus().length,
            speed: `${os.cpus()[0].speed} MHz`,
        };

        systemInfo.diskUsage = this.getDiskUsage();

        systemInfo.nextboard = {
            version,
        };

        return systemInfo;
    }

    /**
     * Get the operating system version.
     * 
     * @returns {string} The operating syste version.
     */
    static getOSVersion() {
        const platform = os.platform();
        const release = os.release();

        if (platform === 'win32') {
            return this.getWindowsVersion(release);
        } else if (platform === 'linux') {
            return this.getLinuxVersion();
        } else if (platform === 'darwin') {
            return this.getMacVersion(release);
        } else {
            return `Unknown OS (${platform})`;
        }
    }

    /**
     * Get the Windows release version.
     * 
     * @param {string} release - The windows release.
     */
    static getWindowsVersion(release) {
        const versions = {
            "6.3": "Windows 8.1",
            "6.2": "Windows 8",
            "6.1": "Windows 7",
            "6.0": "Windows Vista",
            "5.2": "Windows XP 64-bit",
            "5.1": "Windows XP",
        };

        if (release.startsWith("10.0")) {
            return this.detectWindows10or11();
        }

        return versions[release] || `Unknown Windows version (${release})`;
    }

    /**
     * Detects whether the Windows system is 10 or 11 as both of those versions share the 10.0 versioning.
     * 
     * @returns {string} The Windows version.
     */
    static detectWindows10or11() {
        try {
            const output = execSync('wmic os get Caption', { encoding: 'utf-8' });
            if (output.includes('Windows 11')) return 'Windows 11';
            if (output.includes('Windows 10')) return 'Windows 10';
        } catch (error) {
            try {
                const regOutput = execSync(
                    'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName',
                    { encoding: "utf8" }
                );

                if (regOutput.includes('Windows 11')) return 'Windows 11';
                if (regOutput.includes('Windows 10')) return 'Windows 10';
            } catch (error) {
                return 'Windows 10 / 11 (unknown exact version)';
            }
        }

        return 'Windows 10 / 11 (unknown exact version)';
    }

    /**
     * Get the Linux distro release name.
     * 
     * @returns {string} The linux release distro.
      */
    static getLinuxVersion() {
        try {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
            const match = osRelease.match(/PRETTY_NAME="(.+?)"/);
            return match ? match[1] : 'Unknown Linux Distribution';
        } catch (error) {
            return 'Uknown Linux Distribution';
        }
    }

    /**
     * Get the exact Mac release.
     * 
     * @param {string} release - The Mac release string. 
     */
    static getMacVersion(release) {
        const versions = {
            "23": "macOS 14 Sonoma",
            "22": "macOS 13 Ventura",
            "21": "macOS 12 Monterey",
            "20": "macOS 11 Big Sur",
            "19": "macOS 10.15 Catalina",
            "18": "macOS 10.14 Mojave",
            "17": "macOS 10.13 High Sierra",
            "16": "macOS 10.12 Sierra",
            "15": "OS X 10.11 El Capitan",
            "14": "OS X 10.10 Yosemite",
            "13": "OS X 10.9 Mavericks",
        };

        const majorVersion = release.split(".")[0];
        return versions[majorVersion] || `Unknown macOS version (Darwin ${release})`;
    }

    /**
     * Get the disk usage for the system.
     * 
     * @returns {Object} An object containing the disk usage for each disk.
     */
    static getDiskUsage() {
        const platform = os.platform();

        if (platform === 'win32') {
            return this.getWindowsDiskUsage();
        } else {
            try {
                const output = execSync('df -h --output=target,size,used,avail', { encoding: 'utf-8' })
                    .trim()
                    .split('\n');
        
                const disks = [];
                output.slice(1).forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length === 4) {
                        const [mount, total, used, free] = parts;
                        disks.push({
                            mount,
                            total: {
                                raw: total,
                                formatted: FileHelper.formatFileSize(total),
                            },
                            used: {
                                raw: used,
                                formatted: FileHelper.formatFileSize(used),
                            },
                            free: {
                                raw: free,
                                formatted: FileHelper.formatFileSize(free),
                            },
                            percentage: this.calculateStoragePercentage(Number(total), Number(free))
,                        });
                    }
                });
        
                return disks;
            } catch (error) {
                return { error: 'Disk info unavailable on this OS' };
            }
        }
    }

    /**
     * Get the current disk usage for Windows systems.
     * 
     * @returns {Object} An object containing the disk usage for each disk.
     */
    static getWindowsDiskUsage() {
        try {
            const output = execSync(
                'powershell -Command "wmic logicaldisk get caption,size,freespace"',
                { encoding: 'utf-8' }
            ).trim();

            const lines = output.split('\n').slice(1); // Skip header
            const disks = [];

            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length === 3) {
                    const [drive, free, total] = parts;
                    disks.push({
                        mount: drive,
                        total: {
                            raw: Number(total),
                            formatted: FileHelper.formatFileSize(Number(total)),
                        },
                        free: {
                            raw: Number(free),
                            formatted: FileHelper.formatFileSize(Number(free)),
                        },
                        used: {
                            raw: Number(total) - Number(free),
                            formatted: FileHelper.formatFileSize(Number(total) - Number(free)),
                        },
                        percentage: this.calculateStoragePercentage(Number(total), Number(free)),
                    });
                }
            });

            return disks;
        } catch (error) {
            console.log(error);
            return { error: 'Disk info unavailable' };
        }
    }

    /**
     * Calculate the percentage used on the given disk data.
     * 
     * @param {number} total - The total disk space.
     * @param {number} free - The free disk space.
     * @returns {string} The percentage.
     */
    static calculateStoragePercentage(total, free) {
        return `${((free / total) * 100).toFixed(2)}%`;
    }

    /**
     * Gets the AdminCP menu settings for the signed in Administrator.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object containing the menu settings.
     */
    static async getMenuSettings() {
        const member = MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const data = cache.get('menu_tracker').find(tracker => tracker.memberId === member.getId());
        const found = data ? true : false;
        let finalData;

        if (!found) {
            finalData = await this.createDefaultMenuData();
        } else {
            finalData = JSON.parse(data.data);
        }

        return finalData;
    }

    /**
     * Updates the menu category toggled state.
     * 
     * @param {string} category - The category identifier string.
     * @param {boolean} toggle - True if expanded, false if collapsed.
     */
    static async updateMenuCategoryToggle(category, toggle) {
        const member = MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        const data = cache.get('menu_tracker').find(tracker => tracker.memberId == member.getId());
        const exists = data ? true : false;
        let menuData, id;

        if (!exists) {
            const mData = await this.createDefaultMenuData();
            menuData = mData.menuData;
            id = mData.id;
        } else {
            menuData = JSON.parse(data.data);
            id = data.id;
        }

        if (!menuData.categories) {
            menuData.categories = {};
        }

        menuData.categories = menuData.categories.map(cat =>
            cat.id === category ? { ...cat, expanded: toggle } : cat
        );

        console.log(menuData);

        await db.query(builder
            .clear()
            .update('menu_tracker')
            .set([
                'data', 'lastUpdated'
            ], [
                JSON.stringify(menuData), DateTimeHelper.dateToEpoch(new Date())
            ])
            .where('id = ?', [id])
            .build()
        );

        await cache.update('menu_tracker');
    }

    /**
     * Updates the menu item selection flag.
     * 
     * @param {string} category - The category identifier string.
     * @param {string} item - The item identifier string.
     * @param {boolean} selected - True if selected, false if not.
     */
    static async updateMenuSelectedItem(category, item, selected) {
        const member = MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();
        const data = cache.get('menu_tracker').find(tracker => tracker.memberId == member.getId());
        const exists = data ? true : false;
        let menuData, id;

        if (!exists) {
            const mData = await this.createDefaultMenuData();
            menuData = mData.menuData;
            id = mData.id;
        } else {
            menuData = JSON.parse(data.data);
            id = data.id;
        }

        menuData.categories.forEach(cat => {
            if (cat.id === category) {
                cat.items.forEach(i => {
                    if (i.id === item) {
                        i.selected = selected;
                    }
                });
            }
        });

        await db.query(builder
            .clear()
            .update('menu_tracker')
            .set([
                'data', 'lastUpdated'
            ], [
                JSON.stringify(menuData), DateTimeHelper.dateToEpoch(new Date())
            ])
            .where('id = ?', [id])
            .build()
        );

        await cache.update('menu_tracker');
    }

    /**
     * Creates the default menu data for the user.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object that contains the menu data.
     */
    static async createDefaultMenuData() {
        const member = MemberService.getMember();
        const cache = CacheProviderFactory.create();
        const db = DatabaseProviderFactory.create();
        const builder = new QueryBuilder();

        const menuData = {
            categories: [
                {
                    id: 'general',
                    expanded: true,
                    items: [
                        {
                            id: 'dashboard',
                            selected: true,
                        }
                    ]
                },
                {
                    id: 'forum-management',
                    expanded: false,
                    items: [
                        {
                            id: 'manage-forums',
                            selected: false,
                        },
                        {
                            id: 'manage-features',
                            selected: false,
                        }
                    ]
                }
            ]
        };

        const result = await db.query(builder
            .clear()
            .insertInto('menu_tracker', [
                'memberId', 'data', 'lastUpdated'
            ], [
                member.getId(), JSON.stringify(menuData), DateTimeHelper.dateToEpoch(new Date())
            ])
            .build()
        );

        await cache.update('menu_tracker');

        return {
            menuData,
            id: result.insertId,
        };
    }

    /**
     * Convert the menu data object for ease of use with EJS.
     * 
     * @param {Object} menuData - The menu data object instance.
     * @returns {Object} The converted menu data object.
     */
    static async convertMenuData(menuData) {
        if (!menuData) {
            await this.createDefaultMenuData();
        }

        const converted = {};

        menuData.categories.forEach(cat => {
            converted[cat.id] = {
                id: cat.id,
                expanded: cat.expanded,
                items: {},
            };

            cat.items.forEach(item => {
                converted[cat.id].items[item.id] = {
                    id: item.id,
                    selected: item.selected,
                };
            });
        });

        return converted;
    }

    /**
     * Build an URL.
     * 
     * @param {string[]} [segments=null] - An array of segments of the URL (e.g., one/two/three) (default is null).
     * @param {Object} [options={}] - Options for building the URL.
     * @param {Object} [options.query=null] - Optional query string object (default is null).
     * @returns {string} The URL web address string. 
     */
    static buildUrl(segments = null, options = {}) {
        const {query = null } = options;
        let url = `${process.env.BASE_URL}/admincp`;
        let initial = true;
        if (!segments) return url;

        segments.forEach(segment => {
            url += `/${segment}`;
        });

        if (query) {
            for (const key in query) {
                url += `${initial ? '?' : '&'}${key}=${query[key]}`;
                initial = false;
            }
        }

        return url;
    }

    /**
     * Manages the selected menu items from a given path.
     * 
     * @param {string} path - The current path.
     */
    static async manageSelectedMenuItems(path) {
        if (path.includes('admincp')) {
            if (path === 'admincp/' || path === 'admincp' || path === '/admincp' || path === '/admincp/' || path.includes('admincp/dashboard')) {
                await this.unselectMenuItemsExcept('general', 'dashboard');
            } else if (path.includes('admincp/forummanagement/manageforums')) {
                await this.unselectMenuItemsExcept('forum-management', 'manage-forums');
            } else if (path.includes('admincp/forummanagement/managefeatures')) {
                await this.unselectMenuItemsExcept('forum-management', 'manage-features');
            }
        }
    }

    /**
     * Unselects the menu items except for the given menu item.
     * 
     * @param {string} category - The category identifier string.
     * @param {string} item - The item identifier string.
     */
    static async unselectMenuItemsExcept(category, item) {
        await UtilHelper.updateMenuSelectedItem(category, item, true);;

        const legend = [
            {
                category: 'general',
                items: [
                    'dashboard'
                ]
            },
            {
                category: 'forum-management',
                items: [
                    'manage-forums',
                    'manage-features'
                ]
            }
        ];

        for (const i of legend) {
            for (const k of i.items) {
                if (k !== item) {
                    await UtilHelper.updateMenuSelectedItem(i.category, k, false);
                }
            }
        }
    }
}

module.exports = UtilHelper;