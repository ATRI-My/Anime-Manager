import { ipcMain, app, shell, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { AppData, ToolConfig } from '../shared/types'
import { DEFAULT_APP_DATA, DEFAULT_SETTINGS } from '../shared/constants'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const accessAsync = promisify(fs.access)
const mkdirAsync = promisify(fs.mkdir)

const SETTINGS_FILE_NAME = 'settings.json'
const ANIME_DATA_FILE_NAME = 'anime-data.json'

type Settings = typeof DEFAULT_SETTINGS

type OldToolConfig = {
  useCustomTool: boolean
  customTool: {
    name: string
    path: string
    arguments: string
  }
}

function migrateToolConfig(config: any): ToolConfig {
  // 旧结构：包含 useCustomTool 字段
  if (config && typeof config === 'object' && 'useCustomTool' in config) {
    const old = config as OldToolConfig
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
    }
  }

  // 新结构但缺失字段时，合并默认值
  const merged: ToolConfig = {
    url: { ...DEFAULT_SETTINGS.toolConfig.url, ...(config?.url ?? {}) },
    magnet: { ...DEFAULT_SETTINGS.toolConfig.magnet, ...(config?.magnet ?? {}) },
    localFile: { ...DEFAULT_SETTINGS.toolConfig.localFile, ...(config?.localFile ?? {}) },
    lastTestResults: config?.lastTestResults
  }

  return merged
}

function migrateSettings(data: any): Settings {
  if (!data || typeof data !== 'object') {
    return DEFAULT_SETTINGS
  }

  const toolConfig = migrateToolConfig((data as any).toolConfig ?? {})

  return {
    ...DEFAULT_SETTINGS,
    ...data,
    toolConfig
  }
}

function getSettingsPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, SETTINGS_FILE_NAME)
}

function getAnimeDataPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, ANIME_DATA_FILE_NAME)
}

async function ensureSettingsFileExists(): Promise<void> {
  const settingsPath = getSettingsPath()
  try {
    await accessAsync(settingsPath, fs.constants.F_OK)
  } catch {
    await mkdirAsync(path.dirname(settingsPath), { recursive: true })
    await writeFileAsync(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2))
  }
}

async function ensureAnimeDataFileExists(): Promise<void> {
  const animeDataPath = getAnimeDataPath()
  try {
    await accessAsync(animeDataPath, fs.constants.F_OK)
  } catch {
    await mkdirAsync(path.dirname(animeDataPath), { recursive: true })
    await writeFileAsync(animeDataPath, JSON.stringify(DEFAULT_APP_DATA, null, 2))
  }
}

export function registerFileSystemHandlers(): void {
  ipcMain.handle('read-file', async (_event, filePath: string) => {
    try {
      const data = await readFileAsync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`读取文件失败: ${errorMessage}`)
    }
  })

  ipcMain.handle('write-file', async (_event, filePath: string, content: any) => {
    try {
      await writeFileAsync(filePath, JSON.stringify(content, null, 2))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`写入文件失败: ${errorMessage}`)
    }
  })

  ipcMain.handle('write-log-file', async (_event, content: string) => {
    try {
      const logDir = path.join(app.getPath('userData'), 'logs')
      const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`)
      
      // 确保日志目录存在
      try {
        await accessAsync(logDir)
      } catch {
        await mkdirAsync(logDir, { recursive: true })
      }
      
      // 追加内容到日志文件
      const timestamp = new Date().toISOString()
      const logEntry = `\n=== ${timestamp} ===\n${content}\n`
      
      await writeFileAsync(logFile, logEntry, { flag: 'a' })
      return { success: true }
    } catch (error) {
      console.error('写入日志文件失败:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('get-settings', async () => {
    try {
      await ensureSettingsFileExists()
      const settingsPath = getSettingsPath()
      const data = await readFileAsync(settingsPath, 'utf8')
      const parsed = JSON.parse(data)
      return migrateSettings(parsed)
    } catch (error) {
      console.error('获取设置失败，返回默认设置:', error)
      return DEFAULT_SETTINGS
    }
  })

  ipcMain.handle('save-settings', async (_event, settings: Settings) => {
    try {
      const settingsPath = getSettingsPath()
      await mkdirAsync(path.dirname(settingsPath), { recursive: true })
      await writeFileAsync(settingsPath, JSON.stringify(settings, null, 2))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`保存设置失败: ${errorMessage}`)
    }
  })

  ipcMain.handle('open-with-tool', async (_event, url: string, toolConfig: ToolConfig) => {
    try {
      const linkType = (() => {
        if (url.startsWith('magnet:')) return 'magnet' as const
        if (/^https?:\/\//.test(url)) return 'url' as const
        return 'localFile' as const
      })()

      const typeConfig = toolConfig[linkType]

      if (typeConfig?.enabled && typeConfig.path) {
        const { exec } = await import('child_process')
        const execAsync = promisify(exec)

        let command = `"${typeConfig.path}"`

        if (typeConfig.arguments) {
          command += ' ' + typeConfig.arguments.replace(/{url}/g, `"${url}"`)
        } else {
          command += ` "${url}"`
        }

        await execAsync(command)
        return { success: true }
      }

      // 未启用自定义工具时使用默认方式
      if (linkType === 'localFile') {
        const result = await shell.openPath(url)
        if (result) {
          return { success: false, error: `无法打开文件: ${result}` }
        }
        return { success: true }
      }

      await shell.openExternal(url)
      return { success: true }
    } catch (error) {
      console.error('打开失败:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('read-anime-data', async () => {
    try {
      console.log('开始读取动漫数据...')
      await ensureAnimeDataFileExists()
      const animeDataPath = getAnimeDataPath()
      console.log('动漫数据文件路径:', animeDataPath)
      const data = await readFileAsync(animeDataPath, 'utf8')
      console.log('读取到的文件内容长度:', data.length)
      const parsedData = JSON.parse(data)
      console.log('解析后的数据版本:', parsedData.version)
      console.log('动漫数量:', parsedData.animeList?.length || 0)
      return parsedData
    } catch (error) {
      console.error('读取动漫数据失败，返回默认数据:', error)
      return DEFAULT_APP_DATA
    }
  })

  ipcMain.handle('write-anime-data', async (_event, content: AppData) => {
    try {
      const animeDataPath = getAnimeDataPath()
      await mkdirAsync(path.dirname(animeDataPath), { recursive: true })
      await writeFileAsync(animeDataPath, JSON.stringify(content, null, 2))
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`保存动漫数据失败: ${errorMessage}`)
    }
  })

  ipcMain.handle('open-file-dialog', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: '打开动漫数据文件',
        filters: [
          { name: 'JSON文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile']
      })
      return result
    } catch (error) {
      console.error('打开文件对话框失败:', error)
      return { canceled: true, filePaths: [] }
    }
  })

  ipcMain.handle('save-file-dialog', async () => {
    try {
      const result = await dialog.showSaveDialog({
        title: '保存动漫数据文件',
        filters: [
          { name: 'JSON文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] }
        ],
        defaultPath: 'anime-data.json'
      })
      return result
    } catch (error) {
      console.error('保存文件对话框失败:', error)
      return { canceled: true, filePath: '' }
    }
  })

  ipcMain.handle('open-data-folder', async () => {
    try {
      const userDataPath = app.getPath('userData')
      await shell.openPath(userDataPath)
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('打开数据文件夹失败:', error)
      return { success: false, error: errorMessage }
    }
  })
}