const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    fetchData: () => ipcRenderer.invoke('fetch-data'),
    sendData: (text) => ipcRenderer.invoke('send-data', text),
    getVolume: () => ipcRenderer.invoke('get-volume'),
    setVolume: (value) => ipcRenderer.invoke('set-volume', value),
    openKeyboard: () => ipcRenderer.send('open-keyboard')
});