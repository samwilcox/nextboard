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

const fs = require('fs');
const path = require('path');

/**
 * Helpers for managing local files.
 */
class FileHelper {
    /**
     * Create a new file with the given content.
     * 
     * @param {string} filePath - Path of the file to create.
     * @param {string} content - Content to write to the file.
     * @throws {Error} If the file creation process fails.
     */
    static createFile(filePath, content = '') {
        try {
            fs.writeFileSync(filePath, content, { flag: 'wx' });
        } catch (error) {
            console.error(`Error creating file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Write content to an existing file (overwrites content).
     * 
     * @param {string} filePath - Path of the file to write to. 
     * @param {string} content - Content to write to the file. 
     * @throws {Error} If the file write process fails.
     */
    static writeFile(filePath, content = '') {
        try {
            fs.writeFileSync(filePath, content);
        } catch (error) {
            console.error(`Error writing data to file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Append content to a file.
     * 
     * @param {string} filePath - Path of the file to append to.
     * @param {string} content - Content to append to the file.
     * @throws {Error} If the append to file process fails.
     */
    static appendToFile(filePath, content) {
        try {
            fs.appendFileSync(filePath, content);
        } catch (error) {
            console.error(`Error appending to file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Read the content from a file.
     * 
     * @param {string} filePath - Path of the file to read content from.
     * @returns {string} The content of the file.
     * @throws {Error} If the file reading process fails.
     */
    static readFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return content;
        } catch (error) {
            console.error(`Error reading content from file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Delete a file.
     * 
     * @param {string} filePath - Path of the file to delete.
     * @throws {Error} If the file deletion process fails.
     */
    static deleteFile(filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error deleting the file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Set permissions on a file.
     * 
     * @param {string} filePath - Path of the file to set permissions on.
     * @param {number} mode - Permissions in octel (e.g., 0x644).
     * @throws {Error} If the set permissions process fails.
     */
    static setPermissions(filePath, mode) {
        try {
            fs.chmod(filePath, mode);
        } catch (error) {
            console.error(`Error setting permissions on file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Move a file to a new location.
     * 
     * @param {string} filePath - Path of the file to move.
     * @param {string} destination - Path to move the file to.
     * @throws {Error} If the file moving process fails.
     */
    static moveFile(filePath, destination) {
        try {
            const destinationDir = path.dirname(destination);
            fs.mkdirSync(destinationDir, { recursive: true });
            fs.renameSync(filePath, destination);
        } catch (error) {
            console.error(`Error moving file '${filePath}' to destination file '${destination}'.`);
            throw error;
        }
    }

    /**
     * Get the size of a file.
     * 
     * @param {string} filePath - Path of the file to get the size on.
     * @returns {number} The total file size in bytes.
     * @throws {Error} If the file size retrieval process fails.
     */
    static fileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch (error) {
            console.error(`Error reading the size of the file: ${filePath}.`);
            throw error;
        }
    }

    /**
     * Creates the directory if it does not exist.
     * 
     * @param {string} directory - The path to the directory to create if it does not exist.
     */
    static createDirectoryIfNotExists(directory) {
        try {
            fs.mkdirSync(directory, { recursive: true });
        } catch (error) {
            console.error(`Error creating directory: ${directory}.`);
            throw error;
        }
    }

    /**
     * Converts a file size in bytes to a human-readable format.
     * 
     * @param {number} bytes - The file size in bytes.
     * @returns {string} A humean-readable file size (e.g., '1.23 MB").
     */
    static formatFileSize(bytes) {
        const Settings = require('../settings');
        if (bytes === 0) return "0 B";

        const sizeUnits = Settings.get('fileSizeUnits');
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2);

        return `${formattedSize} ${sizeUnits[i]}`;
    }

    /**
     * Deletes the contents of a directory.
     * 
     * @param {string} dirPath - The path to the directory to clear.
     */
    static deleteDirectoryContents(dirPath) {
        const Settings = require('../settings');
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                this.deleteDirectoryContents(filePath);
                fs.rmdirSync(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });
    }
}

module.exports = FileHelper;