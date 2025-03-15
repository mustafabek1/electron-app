const { app, BrowserWindow, ipcMain } = require("electron");
const loudness = require("loudness");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile("index.html");
});

ipcMain.handle("get-volume", async () => {
    return await loudness.getVolume();
});

ipcMain.handle("set-volume", async (_, value) => {
    await loudness.setVolume(value);
});
