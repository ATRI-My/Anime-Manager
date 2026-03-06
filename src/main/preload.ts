import { contextBridge, ipcRenderer } from 'electron'
import { AppData, Settings, ToolConfig } from '../shared/types'

contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作API
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: any) => ipcRenderer.invoke('write-file', filePath, content),
  
  // 日志文件API
  writeLogFile: (content: string) => ipcRenderer.invoke('write-log-file', content),
  
  // 文件对话框API
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: () => ipcRenderer.invoke('save-file-dialog'),
  
  // 动漫数据API
  readAnimeData: () => ipcRenderer.invoke('read-anime-data'),
  writeAnimeData: (content: AppData) => ipcRenderer.invoke('write-anime-data', content),
  
  // 设置API
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Settings) => ipcRenderer.invoke('save-settings', settings),
  
  // 工具打开API
  openWithTool: (url: string, toolConfig: ToolConfig) => ipcRenderer.invoke('open-with-tool', url, toolConfig),
  
  // 数据文件夹API
  openDataFolder: () => ipcRenderer.invoke('open-data-folder')
})

  // 为TypeScript提供类型声明
  declare global {
    interface Window {
      electronAPI: {
        readFile: (filePath: string) => Promise<any>
        writeFile: (filePath: string, content: any) => Promise<{ success: boolean }>
        writeLogFile: (content: string) => Promise<{ success: boolean; error?: string }>
        openFileDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>
        saveFileDialog: () => Promise<{ canceled: boolean; filePath: string }>
        readAnimeData: () => Promise<AppData>
        writeAnimeData: (content: AppData) => Promise<{ success: boolean }>
        getSettings: () => Promise<Settings>
        saveSettings: (settings: Settings) => Promise<{ success: boolean }>
        openWithTool: (url: string, toolConfig: ToolConfig) => Promise<{ success: boolean; error?: string }>
        openDataFolder: () => Promise<{ success: boolean; error?: string }>
      }
    }
  }