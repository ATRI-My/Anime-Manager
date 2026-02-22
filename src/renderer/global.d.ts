// 扩展Window接口以包含electronAPI
import { AppData, Settings, ToolConfig } from '../shared/types'

interface ElectronAPI {
  readFile?: (filePath: string) => Promise<any>
  writeFile?: (filePath: string, content: any) => Promise<{ success: boolean }>
  getSettings?: () => Promise<Settings>
  saveSettings?: (settings: Settings) => Promise<{ success: boolean }>
  openWithTool?: (url: string, toolConfig: ToolConfig) => Promise<{ success: boolean; error?: string }>
  readAnimeData?: () => Promise<AppData>
  writeAnimeData?: (content: AppData) => Promise<{ success: boolean }>
  openFileDialog?: () => Promise<{ canceled: boolean; filePaths: string[] }>
  saveFileDialog?: () => Promise<{ canceled: boolean; filePath: string }>
  openDataFolder?: () => Promise<{ success: boolean; error?: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {};