const { app, BrowserWindow, ipcMain } = require("electron");
const loudness = require("loudness");
const { exec } = require('child_process');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    mainWindow.loadFile("index.html");
});

ipcMain.on('open-keyboard', () => {
    exec('osk.exe', (error) => {
        if (error) {
            console.error('Klavye açılırken hata oluştu:', error);
        }
    });
});

ipcMain.handle("get-volume", async () => {
    return await loudness.getVolume();
});

ipcMain.handle("set-volume", async (_, value) => {
    await loudness.setVolume(value);
});
