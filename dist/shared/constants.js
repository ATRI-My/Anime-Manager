"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_FILE_TYPES = exports.APP_VERSION = exports.DEFAULT_APP_DATA = exports.DEFAULT_SETTINGS = exports.DEFAULT_VIRTUAL_SCROLL_CONFIG = exports.VIRTUALIZATION_THRESHOLDS = exports.WATCH_METHODS = void 0;
exports.WATCH_METHODS = ['本地播放器', '在线观看', '下载观看'];
// 虚拟化组件阈值配置
exports.VIRTUALIZATION_THRESHOLDS = {
    // 动漫列表阈值：超过20个动漫时使用虚拟化网格
    ANIME_GRID: 20,
    // 剧集列表阈值：超过50个剧集时使用虚拟化列表
    EPISODE_LIST: 50
};
// 默认虚拟滚动配置
exports.DEFAULT_VIRTUAL_SCROLL_CONFIG = {
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
};
exports.DEFAULT_SETTINGS = {
    toolConfig: {
        useCustomTool: false,
        customTool: {
            name: '',
            path: '',
            arguments: ''
        }
    },
    virtualScrollConfig: exports.DEFAULT_VIRTUAL_SCROLL_CONFIG
};
exports.DEFAULT_APP_DATA = {
    version: '1.0.0',
    animeList: []
};
exports.APP_VERSION = '1.0.0';
exports.SUPPORTED_FILE_TYPES = ['.mp4', '.mkv', '.avi', '.mov', '.wmv'];
