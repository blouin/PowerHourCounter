const { app, screen, dialog, ipcMain, BrowserWindow } = require('electron')
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

// Copied from utilities/electron
// TODO: Find a way to use constants in both "electron world" and "react world"
const IPC_MESSAGE_SELECT_FOLDER_REQUEST = 'select-dirs-request';
const IPC_MESSAGE_SELECT_FOLDER_RESPONSE = 'select-dirs-response';
const IPC_MESSAGE_UPDATE_AVAILABLE = 'update-available';
const IPC_MESSAGE_UPDATE_DOWNLOADED = 'update-downloaded';
const IPC_MESSAGE_UPDATE_RESTART = 'update-restart-app';

let mainWindow;
function createWindow() {
    const workArea = screen.getPrimaryDisplay().workArea;

    mainWindow = new BrowserWindow({
        width: workArea.width, 
        height: workArea.height,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false // For images, do not remove
        }
    });

    if (!isDev) {
        mainWindow.setMenu(null);
    }

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);

    // Check for updates
    mainWindow.webContents.once('did-finish-load', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Auto update
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send(IPC_MESSAGE_UPDATE_AVAILABLE);
});
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send(IPC_MESSAGE_UPDATE_DOWNLOADED);
});
ipcMain.on(IPC_MESSAGE_UPDATE_RESTART, () => {
    autoUpdater.quitAndInstall();
});

// Search for folder
ipcMain.on(IPC_MESSAGE_SELECT_FOLDER_REQUEST, async (event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: [ 'openDirectory' ]
    })
    event.reply(IPC_MESSAGE_SELECT_FOLDER_RESPONSE, result.filePaths);
});
