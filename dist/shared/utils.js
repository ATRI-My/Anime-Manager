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
 * 模糊搜索动漫列表，支持标签组合搜索
 *
 * @param query 搜索查询字符串，支持空格分隔的标签组合搜索
 * @param animeList 动漫列表
 * @returns 匹配的动漫列表
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
    // 单词搜索 - 保持向后兼容
    if (searchTerms.length === 1) {
        const term = searchTerms[0];
        return animeList.filter(anime => {
            if (anime.title.toLowerCase().includes(term))
                return true;
            if (anime.tags.some(tag => tag.toLowerCase().includes(term)))
                return true;
            if (anime.description?.toLowerCase().includes(term))
                return true;
            return false;
        });
    }
    // 多词搜索 - 新功能
    return animeList.filter(anime => {
        return matchesMultiTermSearch(anime, searchTerms);
    });
}
/**
 * 检查动漫是否匹配多词搜索
 *
 * @param anime 动漫对象
 * @param searchTerms 小写搜索词数组
 * @returns 是否匹配
 *
 * 算法逻辑：
 * 1. 预计算动漫的小写标题、描述和标签Set
 * 2. 快速检查：如果任一搜索词在标题中，直接返回true
 * 3. 检查标签AND匹配：
 *    - 对于每个搜索词，检查是否在标签中存在（包含匹配）
 *    - 如果标签不匹配，检查是否在描述中
 *    - 如果都不匹配，返回false
 * 4. 所有搜索词都匹配则返回true
 *
 * 性能优化：
 * - 预计算避免重复小写转换
 * - 使用Set提高标签查找效率
 * - 提前短路减少不必要的计算
 */
function matchesMultiTermSearch(anime, searchTerms) {
    // 预计算所有小写字符串，避免重复转换
    const animeTitle = anime.title.toLowerCase();
    const animeDescription = anime.description?.toLowerCase() || '';
    // 将标签转换为小写并创建Set，提高查找效率
    const animeTags = new Set();
    for (const tag of anime.tags) {
        animeTags.add(tag.toLowerCase());
    }
    // 快速检查：如果任一搜索词在标题中，直接返回true（标题匹配优先）
    for (const term of searchTerms) {
        if (animeTitle.includes(term)) {
            return true;
        }
    }
    // 检查标签AND匹配
    for (const term of searchTerms) {
        let termFound = false;
        // 检查标签是否包含当前搜索词（包含匹配，支持模糊搜索）
        for (const tag of animeTags) {
            if (tag.includes(term)) {
                termFound = true;
                break;
            }
        }
        // 如果标签不匹配，检查描述（描述作为后备匹配）
        if (!termFound && !animeDescription.includes(term)) {
            return false;
        }
    }
    return true;
}
