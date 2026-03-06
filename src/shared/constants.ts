import { AppData, Settings, SingleToolConfig, VirtualScrollConfig } from './types'

export const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const

export const WATCH_METHODS = ['本地播放器', '在线观看', '下载观看']

// 虚拟化组件阈值配置
export const VIRTUALIZATION_THRESHOLDS = {
  // 动漫列表阈值：超过20个动漫时使用虚拟化网格
  ANIME_GRID: 20,
  // 剧集列表阈值：超过50个剧集时使用虚拟化列表
  EPISODE_LIST: 50
}

// 默认虚拟滚动配置
export const DEFAULT_VIRTUAL_SCROLL_CONFIG: VirtualScrollConfig = {
  enabled: true,
  overscan: 2,
  animeGrid: {
    columns: 3,
    gap: 4,
    itemHeight: 400,
    threshold: 20
  },
  episodeList: {
    itemHeight: 80,
    threshold: 50,
    height: 600
  }
}

const createDefaultSingleToolConfig = (): SingleToolConfig => ({
  enabled: false,
  name: '',
  path: '',
  arguments: ''
})

export const DEFAULT_SETTINGS: Settings = {
  toolConfig: {
    url: createDefaultSingleToolConfig(),
    magnet: createDefaultSingleToolConfig(),
    localFile: createDefaultSingleToolConfig()
  },
  virtualScrollConfig: DEFAULT_VIRTUAL_SCROLL_CONFIG,
  theme: 'light',
  language: 'zh-CN'
}

export const DEFAULT_APP_DATA: AppData = {
  version: '1.0.0',
  animeList: []
}

export const APP_VERSION = '1.0.0'

export const SUPPORTED_FILE_TYPES = ['.mp4', '.mkv', '.avi', '.mov', '.wmv']