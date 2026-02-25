"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // 文件操作API
    readFile: (filePath) => electron_1.ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, content) => electron_1.ipcRenderer.invoke('write-file', filePath, content),
    // 日志文件API
    writeLogFile: (content) => electron_1.ipcRenderer.invoke('write-log-file', content),
    // 文件对话框API
    openFileDialog: () => electron_1.ipcRenderer.invoke('open-file-dialog'),
    saveFileDialog: () => electron_1.ipcRenderer.invoke('save-file-dialog'),
    // 动漫数据API
    readAnimeData: () => electron_1.ipcRenderer.invoke('read-anime-data'),
    writeAnimeData: (content) => electron_1.ipcRenderer.invoke('write-anime-data', content),
    // 设置API
    getSettings: () => electron_1.ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => electron_1.ipcRenderer.invoke('save-settings', settings),
    // 工具打开API
    openWithTool: (url, toolConfig) => electron_1.ipcRenderer.invoke('open-with-tool', url, toolConfig),
    // 数据文件夹API
    openDataFolder: () => electron_1.ipcRenderer.invoke('open-data-folder')
});
