"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.formatDate = formatDate;
exports.isValidUrl = isValidUrl;
exports.fuzzySearch = fuzzySearch;
const uuid_1 = require("uuid");
// 常量定义
const WHITESPACE_REGEX = /\s+/;
function generateId() {
    return (0, uuid_1.v4)();
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * 计算单个动漫对于给定搜索词的匹配得分
 *
 * 评分规则（分值越高匹配度越高）：
 * - 标题完全匹配（忽略大小写）：100
 * - 标题以搜索词开头：80
 * - 标题包含搜索词：60
 * - 标签完全匹配：50
 * - 标签包含搜索词：30
 * - 描述包含搜索词：10
 *
 * 多词搜索时，各词得分累加，并要求至少所有词在某个字段都能命中。
 *
 * @param anime 动漫对象
 * @param searchTerms 小写搜索词数组
 * @returns 匹配得分，-1 表示不匹配
 */
function scoreAnime(anime, searchTerms) {
    const animeTitle = anime.title.toLowerCase();
    const animeDescription = anime.description?.toLowerCase() || '';
    const animeTags = anime.tags.map(t => t.toLowerCase());
    let totalScore = 0;
    for (const term of searchTerms) {
        let termScore = 0;
        // 标题匹配（权重最高）
        if (animeTitle === term) {
            termScore += 100;
        }
        else if (animeTitle.startsWith(term)) {
            termScore += 80;
        }
        else if (animeTitle.includes(term)) {
            termScore += 60;
        }
        // 标签匹配
        for (const tag of animeTags) {
            if (tag === term) {
                termScore += 50;
                break;
            }
            else if (tag.includes(term)) {
                termScore += 30;
                break;
            }
        }
        // 描述匹配（权重最低）
        if (animeDescription.includes(term)) {
            termScore += 10;
        }
        // 如果某个词完全没有匹配，视为不匹配（多词AND语义）
        if (termScore === 0) {
            return -1;
        }
        totalScore += termScore;
    }
    return totalScore;
}
/**
 * 模糊搜索动漫列表，支持标签组合搜索，结果按匹配度从高到低排序
 *
 * @param query 搜索查询字符串，支持空格分隔的标签组合搜索
 * @param animeList 动漫列表
 * @returns 匹配的动漫列表，按匹配度排序（匹配度高的在前）
 *
 * @example
 * // 单词语义搜索（向后兼容）
 * fuzzySearch('火影', animeList) // 搜索标题、标签、描述中包含"火影"的动漫
 *
 * @example
 * // 标签组合搜索（AND逻辑）
 * fuzzySearch('动作 冒险', animeList) // 搜索同时包含"动作"和"冒险"标签的动漫
 *
 * @example
 * // 混合搜索
 * fuzzySearch('海贼 动作', animeList) // 搜索标题包含"海贼"或同时包含"动作"标签的动漫
 *
 * 搜索逻辑：
 * 1. 空查询返回所有动漫
 * 2. 单词搜索：在标题、标签、描述中搜索包含关系（向后兼容）
 * 3. 多词搜索：支持标签组合搜索
 *    - 标签搜索：AND逻辑（所有搜索词都必须在标签中存在）
 *    - 标题/描述搜索：OR逻辑（任一搜索词在标题或描述中）
 *    - 混合逻辑：标签AND 或 标题/描述OR
 * 4. 结果按匹配度从高到低排序
 *
 * 性能优化：
 * - 预计算小写转换，避免重复操作
 * - 使用Set进行标签匹配，提高查找效率
 * - 提前短路优化，减少不必要的计算
 * - 正则表达式分割搜索词，处理多个连续空格
 */
function fuzzySearch(query, animeList) {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
        return animeList;
    }
    // 使用正则表达式分割搜索词，处理多个连续空格
    const searchTerms = normalizedQuery.split(WHITESPACE_REGEX).filter(term => term.length > 0);
    if (searchTerms.length === 0) {
        return animeList;
    }
    // 统一走评分逻辑，过滤不匹配项并按分数降序排列
    const scored = [];
    for (const anime of animeList) {
        const score = scoreAnime(anime, searchTerms);
        if (score > 0) {
            scored.push({ anime, score });
        }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map(item => item.anime);
}
