"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const file_system_1 = require("./file-system");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js')
        },
        title: 'Anime Manager',
        icon: path_1.default.join(__dirname, '../assets/icon.png')
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        // 在生产环境中，尝试不同的路径
        const htmlPaths = [
            path_1.default.join(__dirname, '../index.html'), // 正确路径：dist/index.html
            path_1.default.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'), // asar解压
            path_1.default.join(process.resourcesPath, 'app', 'dist', 'index.html'), // asar内
            path_1.default.join(__dirname, 'index.html') // 旧路径（兼容性）
        ];
        let loaded = false;
        for (const htmlPath of htmlPaths) {
            try {
                mainWindow.loadFile(htmlPath);
                console.log(`成功加载HTML文件: ${htmlPath}`);
                loaded = true;
                break;
            }
            catch (error) {
                console.log(`无法加载HTML文件: ${htmlPath}`, error);
            }
        }
        if (!loaded) {
            console.error('无法找到HTML文件，显示错误页面');
            mainWindow.loadURL(`data:text/html,<h1>应用启动失败</h1><p>无法找到HTML文件</p>`);
        }
        // 在生产环境也打开开发者工具以便调试
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    (0, file_system_1.registerFileSystemHandlers)();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
