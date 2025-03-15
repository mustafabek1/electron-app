const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    saveText: (text) => ipcRenderer.send("save-text", text),
});
