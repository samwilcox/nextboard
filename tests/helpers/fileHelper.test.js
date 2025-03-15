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

const testlabjs = require('testlab.js');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const FileHelper = require('../../app/helpers/fileHelper');

let sandbox;

testlabjs.test('createFile › should create a new file with the specified content', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const content = 'Hello, world!';

    const writeStub = sandbox.stub(fs, 'writeFileSync');  // Stub writeFileSync method

    FileHelper.createFile(filePath, content);
    restoreSandbox();
    
    t.true(writeStub.calledOnceWithExactly(filePath, content, { flag: 'wx' }));
});

testlabjs.test('writeFile › should write content to an existing file', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const content = 'New content';

    const writeStub = sandbox.stub(fs, 'writeFileSync');  // Stub writeFileSync method

    FileHelper.writeFile(filePath, content);
    restoreSandbox();

    t.true(writeStub.calledOnceWithExactly(filePath, content));
});

testlabjs.test('appendToFile › should append content to a file', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const content = 'Appended content';

    const appendStub = sandbox.stub(fs, 'appendFileSync');  // Stub appendFileSync method

    FileHelper.appendToFile(filePath, content);
    restoreSandbox();

    t.true(appendStub.calledOnceWithExactly(filePath, content));
});

testlabjs.test('readFile › should read content from a file', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const expectedContent = 'File content';

    const readStub = sandbox.stub(fs, 'readFileSync').returns(expectedContent);  // Stub readFileSync method

    const content = FileHelper.readFile(filePath);
    restoreSandbox();

    t.true(readStub.calledOnceWithExactly(filePath, 'utf-8'));
    t.is(content, expectedContent);
});

testlabjs.test('deleteFile › should delete the specified file', t => {
    createSandbox();
    const filePath = 'testFile.txt';

    const unlinkStub = sandbox.stub(fs, 'unlink');  // Stub unlink method

    FileHelper.deleteFile(filePath);
    restoreSandbox();

    t.true(unlinkStub.calledOnceWithExactly(filePath));
});

testlabjs.test('setPermissions › should set permissions on the file', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const mode = 0o644;

    const chmodStub = sandbox.stub(fs, 'chmod');  // Stub chmod method

    FileHelper.setPermissions(filePath, mode);
    restoreSandbox();

    t.true(chmodStub.calledOnceWithExactly(filePath, mode));
});

testlabjs.test('moveFile › should move a file to the specified destination', t => {
    createSandbox();
    const filePath = 'source.txt';
    const destination = 'dest/destination.txt';

    const mkdirStub = sandbox.stub(fs, 'mkdirSync');  // Stub mkdirSync method
    const renameStub = sandbox.stub(fs, 'renameSync');  // Stub renameSync method
    const dirnameStub = sandbox.stub(path, 'dirname').returns('dest');  // Stub path.dirname method

    FileHelper.moveFile(filePath, destination);
    restoreSandbox();

    t.true(dirnameStub.calledOnceWithExactly(destination));
    t.true(mkdirStub.calledOnceWithExactly('dest', { recursive: true }));
    t.true(renameStub.calledOnceWithExactly(filePath, destination));
});

testlabjs.test('fileSize › should return the size of the specified file', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const fileStats = { size: 1024 };

    const statStub = sandbox.stub(fs, 'statSync').returns(fileStats);  // Stub statSync method

    const size = FileHelper.fileSize(filePath);
    restoreSandbox();

    t.true(statStub.calledOnceWithExactly(filePath));
    t.is(size, 1024);
});

testlabjs.test('createDirectoryIfNotExists › should create a directory if it does not exist', t => {
    createSandbox();
    const directory = 'newDir';

    const mkdirStub = sandbox.stub(fs, 'mkdirSync');  // Stub mkdirSync method

    FileHelper.createDirectoryIfNotExists(directory);
    restoreSandbox();

    t.true(mkdirStub.calledOnceWithExactly(directory, { recursive: true }));
});

testlabjs.test('createFile › should throw an error if file creation fails', t => {
    createSandbox();
    const filePath = 'testFile.txt';
    const content = 'Hello, world!';

    const writeStub = sandbox.stub(fs, 'writeFileSync').throws(new Error('File creation error'));  // Stub with an error

    const error = t.throws(() => FileHelper.createFile(filePath, content), { instanceOf: Error });
    restoreSandbox();

    t.is(error.message, 'File creation error');
    t.true(writeStub.calledOnceWithExactly(filePath, content, { flag: 'wx' }));
});

testlabjs.test('readFile › should throw an error if file reading fails', t => {
    createSandbox();
    const filePath = 'testFile.txt';

    const readStub = sandbox.stub(fs, 'readFileSync').throws(new Error('File read error'));  // Stub with an error

    const error = t.throws(() => FileHelper.readFile(filePath), { instanceOf: Error });
    restoreSandbox();

    t.is(error.message, 'File read error');
    t.true(readStub.calledOnceWithExactly(filePath, 'utf-8'));
});

/**
 * Creates a new sinon sandbox.
 */
const createSandbox = () => {
    sandbox = sinon.createSandbox();
}

/**
 * Restores all stubs, mocks, etc from the sandbox.
 */
const restoreSandbox = () => {
    sandbox.restore();
};