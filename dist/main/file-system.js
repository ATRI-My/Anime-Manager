"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFileSystemHandlers = registerFileSystemHandlers;
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const constants_1 = require("../shared/constants");
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const accessAsync = (0, util_1.promisify)(fs_1.default.access);
const mkdirAsync = (0, util_1.promisify)(fs_1.default.mkdir);
const SETTINGS_FILE_NAME = 'settings.json';
const ANIME_DATA_FILE_NAME = 'anime-data.json';
function migrateToolConfig(config) {
    // 旧结构：包含 useCustomTool 字段
    if (config && typeof config === 'object' && 'useCustomTool' in config) {
        const old = config;
        return {
            url: {
                enabled: false,
                name: '',
                path: '',
                arguments: '{url}'
            },
            magnet: {
                enabled: false,
                name: '',
                path: '',
                arguments: '{url}'
            },
            localFile: {
                enabled: old.useCustomTool,
                name: old.customTool?.name ?? '',
                path: old.customTool?.path ?? '',
                arguments: old.customTool?.arguments ?? '{url}'
            }
        };
    }
    // 新结构但缺失字段时，合并默认值
    const merged = {
        url: { ...constants_1.DEFAULT_SETTINGS.toolConfig.url, ...(config?.url ?? {}) },
        magnet: { ...constants_1.DEFAULT_SETTINGS.toolConfig.magnet, ...(config?.magnet ?? {}) },
        localFile: { ...constants_1.DEFAULT_SETTINGS.toolConfig.localFile, ...(config?.localFile ?? {}) },
        lastTestResults: config?.lastTestResults
    };
    return merged;
}
function migrateSettings(data) {
    if (!data || typeof data !== 'object') {
        return constants_1.DEFAULT_SETTINGS;
    }
    const toolConfig = migrateToolConfig(data.toolConfig ?? {});
    return {
        ...constants_1.DEFAULT_SETTINGS,
        ...data,
        toolConfig
    };
}
function getSettingsPath() {
    const userDataPath = electron_1.app.getPath('userData');
    return path_1.default.join(userDataPath, SETTINGS_FILE_NAME);
}
function getAnimeDataPath() {
    const userDataPath = electron_1.app.getPath('userData');
    return path_1.default.join(userDataPath, ANIME_DATA_FILE_NAME);
}
async function ensureSettingsFileExists() {
    const settingsPath = getSettingsPath();
    try {
        await accessAsync(settingsPath, fs_1.default.constants.F_OK);
    }
    catch {
        await mkdirAsync(path_1.default.dirname(settingsPath), { recursive: true });
        await writeFileAsync(settingsPath, JSON.stringify(constants_1.DEFAULT_SETTINGS, null, 2));
    }
}
async function ensureAnimeDataFileExists() {
    const animeDataPath = getAnimeDataPath();
    try {
        await accessAsync(animeDataPath, fs_1.default.constants.F_OK);
    }
    catch {
        await mkdirAsync(path_1.default.dirname(animeDataPath), { recursive: true });
        await writeFileAsync(animeDataPath, JSON.stringify(constants_1.DEFAULT_APP_DATA, null, 2));
    }
}
function registerFileSystemHandlers() {
    electron_1.ipcMain.handle('read-file', async (_event, filePath) => {
        try {
            const data = await readFileAsync(filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`读取文件失败: ${errorMessage}`);
        }
    });
    electron_1.ipcMain.handle('write-file', async (_event, filePath, content) => {
        try {
            await writeFileAsync(filePath, JSON.stringify(content, null, 2));
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`写入文件失败: ${errorMessage}`);
        }
    });
    electron_1.ipcMain.handle('write-log-file', async (_event, content) => {
        try {
            const logDir = path_1.default.join(electron_1.app.getPath('userData'), 'logs');
            const logFile = path_1.default.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
            // 确保日志目录存在
            try {
                await accessAsync(logDir);
            }
            catch {
                await mkdirAsync(logDir, { recursive: true });
            }
            // 追加内容到日志文件
            const timestamp = new Date().toISOString();
            const logEntry = `\n=== ${timestamp} ===\n${content}\n`;
            await writeFileAsync(logFile, logEntry, { flag: 'a' });
            return { success: true };
        }
        catch (error) {
            console.error('写入日志文件失败:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return { success: false, error: errorMessage };
        }
    });
    electron_1.ipcMain.handle('get-settings', async () => {
        try {
            await ensureSettingsFileExists();
            const settingsPath = getSettingsPath();
            const data = await readFileAsync(settingsPath, 'utf8');
            const parsed = JSON.parse(data);
            return migrateSettings(parsed);
        }
        catch (error) {
            console.error('获取设置失败，返回默认设置:', error);
            return constants_1.DEFAULT_SETTINGS;
        }
    });
    electron_1.ipcMain.handle('save-settings', async (_event, settings) => {
        try {
            const settingsPath = getSettingsPath();
            await mkdirAsync(path_1.default.dirname(settingsPath), { recursive: true });
            await writeFileAsync(settingsPath, JSON.stringify(settings, null, 2));
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`保存设置失败: ${errorMessage}`);
        }
    });
    electron_1.ipcMain.handle('open-with-tool', async (_event, url, toolConfig) => {
        try {
            const linkType = (() => {
                if (url.startsWith('magnet:'))
                    return 'magnet';
                if (/^https?:\/\//.test(url))
                    return 'url';
                return 'localFile';
            })();
            const typeConfig = toolConfig[linkType];
            if (typeConfig?.enabled && typeConfig.path) {
                const { exec } = await Promise.resolve().then(() => __importStar(require('child_process')));
                const execAsync = (0, util_1.promisify)(exec);
                let command = `"${typeConfig.path}"`;
                if (typeConfig.arguments) {
                    command += ' ' + typeConfig.arguments.replace(/{url}/g, `"${url}"`);
                }
                else {
                    command += ` "${url}"`;
                }
                await execAsync(command);
                return { success: true };
            }
            // 未启用自定义工具时使用默认方式
            if (linkType === 'localFile') {
                const result = await electron_1.shell.openPath(url);
                if (result) {
                    return { success: false, error: `无法打开文件: ${result}` };
                }
                return { success: true };
            }
            await electron_1.shell.openExternal(url);
            return { success: true };
        }
        catch (error) {
            console.error('打开失败:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return { success: false, error: errorMessage };
        }
    });
    electron_1.ipcMain.handle('read-anime-data', async () => {
        try {
            console.log('开始读取动漫数据...');
            await ensureAnimeDataFileExists();
            const animeDataPath = getAnimeDataPath();
            console.log('动漫数据文件路径:', animeDataPath);
            const data = await readFileAsync(animeDataPath, 'utf8');
            console.log('读取到的文件内容长度:', data.length);
            const parsedData = JSON.parse(data);
            console.log('解析后的数据版本:', parsedData.version);
            console.log('动漫数量:', parsedData.animeList?.length || 0);
            return parsedData;
        }
        catch (error) {
            console.error('读取动漫数据失败，返回默认数据:', error);
            return constants_1.DEFAULT_APP_DATA;
        }
    });
    electron_1.ipcMain.handle('write-anime-data', async (_event, content) => {
        try {
            const animeDataPath = getAnimeDataPath();
            await mkdirAsync(path_1.default.dirname(animeDataPath), { recursive: true });
            await writeFileAsync(animeDataPath, JSON.stringify(content, null, 2));
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`保存动漫数据失败: ${errorMessage}`);
        }
    });
    electron_1.ipcMain.handle('open-file-dialog', async () => {
        try {
            const result = await electron_1.dialog.showOpenDialog({
                title: '打开动漫数据文件',
                filters: [
                    { name: 'JSON文件', extensions: ['json'] },
                    { name: '所有文件', extensions: ['*'] }
                ],
                properties: ['openFile']
            });
            return result;
        }
        catch (error) {
            console.error('打开文件对话框失败:', error);
            return { canceled: true, filePaths: [] };
        }
    });
    electron_1.ipcMain.handle('save-file-dialog', async () => {
        try {
            const result = await electron_1.dialog.showSaveDialog({
                title: '保存动漫数据文件',
                filters: [
                    { name: 'JSON文件', extensions: ['json'] },
                    { name: '所有文件', extensions: ['*'] }
                ],
                defaultPath: 'anime-data.json'
            });
            return result;
        }
        catch (error) {
            console.error('保存文件对话框失败:', error);
            return { canceled: true, filePath: '' };
        }
    });
    electron_1.ipcMain.handle('open-data-folder', async () => {
        try {
            const userDataPath = electron_1.app.getPath('userData');
            await electron_1.shell.openPath(userDataPath);
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('打开数据文件夹失败:', error);
            return { success: false, error: errorMessage };
        }
    });
}
