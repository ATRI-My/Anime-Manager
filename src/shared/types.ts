export interface Episode {
  id: string
  number: number
  title: string
  url: string
  watched: boolean
  notes?: string
}

export interface Anime {
  id: string
  title: string
  watchMethod: string
  description?: string
  tags: string[]
  episodes: Episode[]
  createdAt: string
  updatedAt: string
}

export interface AppData {
  version: string
  animeList: Anime[]
}

export type LinkType = 'url' | 'magnet' | 'localFile'

export type Theme = 'light' | 'dark'

export type Locale = 'zh-CN' | 'en-US'

export interface SingleToolConfig {
  enabled: boolean
  name: string
  path: string
  arguments: string
}

export interface ToolTestResult {
  success: boolean
  message: string
  timestamp: string
}

export interface ToolConfig {
  url: SingleToolConfig      // 网址 (https://...)
  magnet: SingleToolConfig   // 磁力链接 (magnet:...)
  localFile: SingleToolConfig // 本地文件
  lastTestResults?: {
    url?: ToolTestResult
    magnet?: ToolTestResult
    localFile?: ToolTestResult
  }
}

export interface VirtualScrollConfig {
  // 通用配置
  enabled: boolean
  overscan: number
  
  // 动漫网格配置
  animeGrid: {
    columns: number
    gap: number
    itemHeight: number
    threshold: number
  }
  
  // 剧集列表配置
  episodeList: {
    itemHeight: number
    threshold: number
    height: number
  }
}

export interface Settings {
  toolConfig: ToolConfig
  virtualScrollConfig?: VirtualScrollConfig
  theme?: Theme
  language?: Locale
}