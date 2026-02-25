"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVirtualScrollConfig = getVirtualScrollConfig;
exports.shouldUseVirtualization = shouldUseVirtualization;
exports.getAnimeGridConfig = getAnimeGridConfig;
exports.getEpisodeListConfig = getEpisodeListConfig;
const constants_1 = require("./constants");
/**
 * 获取虚拟滚动配置
 * 如果提供了用户配置，则合并用户配置和默认配置
 * 如果未提供用户配置，则返回默认配置
 */
function getVirtualScrollConfig(userConfig) {
    if (!userConfig) {
        return constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG;
    }
    // 深度合并配置，确保所有字段都有值
    return {
        enabled: userConfig.enabled ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.enabled,
        overscan: userConfig.overscan ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.overscan,
        animeGrid: {
            columns: userConfig.animeGrid?.columns ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.columns,
            gap: userConfig.animeGrid?.gap ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.gap,
            itemHeight: userConfig.animeGrid?.itemHeight ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.itemHeight,
            threshold: userConfig.animeGrid?.threshold ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.animeGrid.threshold
        },
        episodeList: {
            itemHeight: userConfig.episodeList?.itemHeight ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.itemHeight,
            threshold: userConfig.episodeList?.threshold ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.threshold,
            height: userConfig.episodeList?.height ?? constants_1.DEFAULT_VIRTUAL_SCROLL_CONFIG.episodeList.height
        }
    };
}
/**
 * 检查是否应该使用虚拟化
 * 根据项目数量和阈值决定
 */
function shouldUseVirtualization(itemCount, threshold, enabled = true) {
    return enabled && itemCount > threshold;
}
/**
 * 获取动漫网格的虚拟化配置
 */
function getAnimeGridConfig(config) {
    return {
        columns: config.animeGrid.columns,
        gap: config.animeGrid.gap,
        itemHeight: config.animeGrid.itemHeight,
        overscan: config.overscan,
        threshold: config.animeGrid.threshold
    };
}
/**
 * 获取剧集列表的虚拟化配置
 */
function getEpisodeListConfig(config) {
    return {
        itemHeight: config.episodeList.itemHeight,
        height: config.episodeList.height,
        overscan: config.overscan,
        threshold: config.episodeList.threshold
    };
}
