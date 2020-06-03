const electron = window.require && window.require('electron');

// ************
// IPC channels
// ************

export const IPC_MESSAGE_SELECT_FOLDER_REQUEST = 'select-dirs-request';
export const IPC_MESSAGE_SELECT_FOLDER_RESPONSE = 'select-dirs-response';
export const IPC_MESSAGE_UPDATE_AVAILABLE = 'update-available';
export const IPC_MESSAGE_UPDATE_DOWNLOADED = 'update-downloaded';
export const IPC_MESSAGE_UPDATE_RESTART = 'update-restart-app';

// ******************
// Electron detection
// ******************

export const isElectron = window.require && window.require('electron');
export const ipc = electron?.ipcRenderer;

// *************************
// Image retrieval functions
// *************************

const IMAGE_MIME = "image";
export async function getFilesInFolder(folder) {
    const files = await getFiles(folder)
    return files
        .filter(item => isImage(item))
        .map(item => item.replace(/\\/g, "/")); // For HTML background image property
}

async function getFiles(dir) {
    const { resolve } = window.require && window.require('path');
    const { readdir } = window.require && window.require('fs').promises;

    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return Array.prototype.concat(...files);
}

function isImage(file) {
    const mime = window.require && window.require('mime-types');
    
    const mimeType = mime.lookup(file) || "application/octet";
    const mimeTypeFirst = mimeType.substring(0, mimeType.indexOf('/')).toLowerCase();
    return mimeTypeFirst === IMAGE_MIME;
}