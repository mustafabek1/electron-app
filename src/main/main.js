const { app, BrowserWindow, ipcMain } = require("electron");
const loudness = require("loudness");
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false 
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
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

ipcMain.handle('fetch-data', async () => {
    try {
        const response = await axios.get('http://localhost:3000/data');

        return response.data;
    } catch (error) {
        return { storedData: [] };
    }
});

ipcMain.handle("send-data", async (_, text) => {
    try {
        const response = await axios.post("http://localhost:3000/data", { text });

        return response.data;
    } catch (error) {
        return { error: "Gönderme başarısız!" };
    }
});
