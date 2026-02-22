import { VirtualScrollConfig } from './types'
import { DEFAULT_VIRTUAL_SCROLL_CONFIG } from './constants'

/**
 * 获取虚拟滚动配置
 * 如果提供了用户配置，则合并用户配置和默认配置
 * 如果未提供用户配置，则返回默认配置
 */
export function getVirtualScrollConfig(
  userConfig?: VirtualScrollConfig
): VirtualScrollConfig {
  if (!userConfig) {
    return DEFAULT_VIRTUAL_SCROLL_CONFIG
  }

  // 深度合并配置，确保所有字段都有值
  return {
    enabled: userConfig.enabled ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.enabled,
    overscan: userConfig.overscan ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.overscan,
    animeGrid: {
      columns: userConfig.animeGrid?.columns ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.columns,
      gap: userConfig.animeGrid?.gap ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.gap,
      itemHeight: userConfig.animeGrid?.itemHeight ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.itemHeight,
      threshold: userConfig.animeGrid?.threshold ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.threshold
    },
    episodeList: {
      itemHeight: userConfig.episodeList?.itemHeight ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.itemHeight,
      threshold: userConfig.episodeList?.threshold ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.threshold,
      height: userConfig.episodeList?.height ?? DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.height
    }
  }
}

/**
 * 检查是否应该使用虚拟化
 * 根据项目数量和阈值决定
 */
export function shouldUseVirtualization(
  itemCount: number,
  threshold: number,
  enabled: boolean = true
): boolean {
  return enabled && itemCount > threshold
}

/**
 * 获取动漫网格的虚拟化配置
 */
export function getAnimeGridConfig(config: VirtualScrollConfig) {
  return {
    columns: config.animeGrid.columns,
    gap: config.animeGrid.gap,
    itemHeight: config.animeGrid.itemHeight,
    overscan: config.overscan,
    threshold: config.animeGrid.threshold
  }
}

/**
 * 获取剧集列表的虚拟化配置
 */
export function getEpisodeListConfig(config: VirtualScrollConfig) {
  return {
    itemHeight: config.episodeList.itemHeight,
    height: config.episodeList.height,
    overscan: config.overscan,
    threshold: config.episodeList.threshold
  }
}