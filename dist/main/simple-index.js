"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
function createWindow() {
    console.log('创建窗口...');
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js')
        },
        title: 'Anime Manager - 测试',
        show: true
    });
    // 尝试加载本地文件
    const htmlPath = path_1.default.join(__dirname, 'index.html');
    console.log('尝试加载HTML文件:', htmlPath);
    try {
        mainWindow.loadFile(htmlPath);
        console.log('HTML文件加载成功');
    }
    catch (error) {
        console.error('加载HTML文件失败:', error);
        // 显示错误信息
        mainWindow.loadURL(`data:text/html,
      <html>
        <head><title>错误</title></head>
        <body style="padding: 20px; font-family: Arial;">
          <h1>应用启动错误</h1>
          <p>无法加载HTML文件: ${htmlPath}</p>
          <p>错误信息: ${error?.message || '未知错误'}</p>
          <p>当前目录: ${__dirname}</p>
          <p>文件是否存在: ${require('fs').existsSync(htmlPath) ? '是' : '否'}</p>
        </body>
      </html>
    `);
    }
    mainWindow.on('closed', () => {
        console.log('窗口关闭');
        mainWindow = null;
    });
    mainWindow.on('ready-to-show', () => {
        console.log('窗口准备显示');
        if (mainWindow) {
            mainWindow.show();
        }
    });
}
electron_1.app.whenReady().then(() => {
    console.log('Electron应用准备就绪');
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    console.log('所有窗口已关闭');
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});
