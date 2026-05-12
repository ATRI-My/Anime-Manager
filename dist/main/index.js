"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const file_system_1 = require("./file-system");
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            preload: path_1.default.join(__dirname, 'preload.js')
        },
        title: 'Anime Manager',
        icon: path_1.default.join(__dirname, '../assets/icon.png')
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
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
                loaded = true;
                break;
            }
            catch (error) {
            }
        }
        if (!loaded) {
            console.error('无法找到HTML文件，显示错误页面');
            mainWindow.loadURL(`data:text/html,<h1>应用启动失败</h1><p>无法找到HTML文件</p>`);
        }
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    // 注册自定义图片协议 anime-cover://
    electron_1.protocol.handle('anime-cover', async (request) => {
        try {
            const urlObj = new URL(request.url);
            const encodedPath = urlObj.pathname.replace(/^\//, '');
            const filePath = decodeURIComponent(encodedPath);
            const normalizedPath = path_1.default.normalize(filePath);
            const ext = path_1.default.extname(normalizedPath).toLowerCase();
            const mimeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.bmp': 'image/bmp',
            };
            const mimeType = mimeMap[ext] || 'image/png';
            const buffer = await readFileAsync(normalizedPath);
            return new Response(buffer, {
                headers: { 'Content-Type': mimeType, 'Cache-Control': 'no-cache' }
            });
        }
        catch (error) {
            console.error('anime-cover 协议读取失败:', error);
            return new Response('', { status: 404 });
        }
    });
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
