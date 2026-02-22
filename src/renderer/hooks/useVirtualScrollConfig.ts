import { useSettings } from './useSettings'
import { getVirtualScrollConfig, shouldUseVirtualization } from '../../shared/virtual-scroll-utils'

/**
 * 钩子：获取虚拟滚动配置
 * 从设置中读取配置，并提供便捷方法
 */
export const useVirtualScrollConfig = () => {
  const { settings } = useSettings()
  
  // 获取虚拟滚动配置
  const virtualScrollConfig = getVirtualScrollConfig(settings?.virtualScrollConfig)
  
  /**
   * 检查动漫网格是否应该使用虚拟化
   */
  const shouldVirtualizeAnimeGrid = (animeCount: number) => {
    return shouldUseVirtualization(
      animeCount,
      virtualScrollConfig.animeGrid.threshold,
      virtualScrollConfig.enabled
    )
  }
  
  /**
   * 检查剧集列表是否应该使用虚拟化
   */
  const shouldVirtualizeEpisodeList = (episodeCount: number) => {
    return shouldUseVirtualization(
      episodeCount,
      virtualScrollConfig.episodeList.threshold,
      virtualScrollConfig.enabled
    )
  }
  
  /**
   * 获取动漫网格配置
   */
  const getAnimeGridProps = () => {
    return {
      columns: virtualScrollConfig.animeGrid.columns,
      gap: virtualScrollConfig.animeGrid.gap,
      itemHeight: virtualScrollConfig.animeGrid.itemHeight,
      overscan: virtualScrollConfig.overscan
    }
  }
  
  /**
   * 获取剧集列表配置
   */
  const getEpisodeListProps = () => {
    return {
      height: virtualScrollConfig.episodeList.height,
      itemHeight: virtualScrollConfig.episodeList.itemHeight
    }
  }
  
  return {
    config: virtualScrollConfig,
    shouldVirtualizeAnimeGrid,
    shouldVirtualizeEpisodeList,
    getAnimeGridProps,
    getEpisodeListProps
  }
}