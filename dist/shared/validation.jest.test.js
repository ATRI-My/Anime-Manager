"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_js_1 = require("./validation.js");
// 这些测试展示了使用Jest风格的测试结构
// 即使没有安装Jest，这个文件也展示了完整的测试用例
describe('表单验证工具', () => {
    describe('Anime数据验证', () => {
        test('验证有效的Anime数据应该通过', () => {
            const validAnime = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                description: '这是一个测试动漫',
                tags: ['动作', '冒险'],
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(validAnime);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        test('验证缺少id字段的Anime数据应该失败', () => {
            const invalidAnime = {
                title: '测试动漫',
                watchMethod: '在线观看',
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('id不能为空');
        });
        test('验证空标题的Anime数据应该失败', () => {
            const invalidAnime = {
                id: 'test-id-123',
                title: '',
                watchMethod: '在线观看',
                tags: [],
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('标题不能为空');
        });
        test('验证缺少watchMethod字段的Anime数据应该失败', () => {
            const invalidAnime = {
                id: 'test-id-123',
                title: '测试动漫',
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('watchMethod是必填字段');
        });
        test('验证tags不是数组的Anime数据应该失败', () => {
            const invalidAnime = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                tags: '不是数组',
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('tags必须是数组');
        });
        test('验证episodes不是数组的Anime数据应该失败', () => {
            const invalidAnime = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                tags: [],
                episodes: '不是数组',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('episodes必须是数组');
        });
    });
    describe('Episode数据验证', () => {
        test('验证有效的Episode数据应该通过', () => {
            const validEpisode = {
                id: 'episode-123',
                number: 1,
                title: '第一集',
                url: 'https://example.com/episode1',
                watched: false,
                notes: '测试笔记'
            };
            const result = (0, validation_js_1.validateEpisode)(validEpisode);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        test('验证缺少id字段的Episode数据应该失败', () => {
            const invalidEpisode = {
                number: 1,
                title: '第一集',
                url: 'https://example.com/episode1',
                watched: false
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('id是必填字段');
        });
        test('验证无效剧集编号的Episode数据应该失败', () => {
            const invalidEpisode = {
                id: 'episode-123',
                number: -1,
                title: '第一集',
                url: 'https://example.com/episode1',
                watched: false
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('剧集编号必须大于0');
        });
        test('验证空标题的Episode数据应该失败', () => {
            const invalidEpisode = {
                id: 'episode-123',
                number: 1,
                title: '',
                url: 'https://example.com/episode1',
                watched: false
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('标题不能为空');
        });
        test('验证无效URL的Episode数据应该失败', () => {
            const invalidEpisode = {
                id: 'episode-123',
                number: 1,
                title: '第一集',
                url: '不是有效的URL',
                watched: false
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('url必须是有效的URL格式');
        });
        test('验证缺少watched字段的Episode数据应该失败', () => {
            const invalidEpisode = {
                id: 'episode-123',
                number: 1,
                title: '第一集',
                url: 'https://example.com/episode1'
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('watched是必填字段且必须是布尔值');
        });
    });
    describe('数据完整性验证', () => {
        test('验证Anime包含无效Episode数据应该失败', () => {
            const animeWithInvalidEpisode = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                tags: [],
                episodes: [
                    {
                        id: 'episode-123',
                        number: 1,
                        title: '第一集',
                        url: '无效URL',
                        watched: false
                    }
                ],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(animeWithInvalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('episodes包含无效数据'))).toBe(true);
        });
        test('验证Anime包含重复剧集编号应该失败', () => {
            const animeWithDuplicateEpisodes = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                tags: [],
                episodes: [
                    {
                        id: 'episode-1',
                        number: 1,
                        title: '第一集',
                        url: 'https://example.com/episode1',
                        watched: false
                    },
                    {
                        id: 'episode-2',
                        number: 1,
                        title: '另一个第一集',
                        url: 'https://example.com/episode1-dup',
                        watched: false
                    }
                ],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(animeWithDuplicateEpisodes);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('重复'))).toBe(true);
        });
    });
    describe('Anime列表验证', () => {
        test('验证有效的Anime列表应该通过', () => {
            const validAnimeList = [
                {
                    id: 'anime-1',
                    title: '动漫1',
                    watchMethod: '在线观看',
                    tags: [],
                    episodes: [],
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 'anime-2',
                    title: '动漫2',
                    watchMethod: '下载观看',
                    tags: ['动作'],
                    episodes: [],
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z'
                }
            ];
            const result = (0, validation_js_1.validateAnimeList)(validAnimeList);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        test('验证包含无效Anime的列表应该失败', () => {
            const invalidAnimeList = [
                {
                    id: 'anime-1',
                    title: '动漫1',
                    watchMethod: '在线观看',
                    tags: [],
                    episodes: [],
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    // 缺少id
                    title: '动漫2',
                    watchMethod: '下载观看',
                    tags: [],
                    episodes: [],
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z'
                }
            ];
            const result = (0, validation_js_1.validateAnimeList)(invalidAnimeList);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        test('验证包含重复ID的Anime列表应该失败', () => {
            const animeListWithDuplicateIds = [
                {
                    id: 'same-id',
                    title: '动漫1',
                    watchMethod: '在线观看',
                    tags: [],
                    episodes: [],
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 'same-id', // 重复的ID
                    title: '动漫2',
                    watchMethod: '下载观看',
                    tags: [],
                    episodes: [],
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z'
                }
            ];
            const result = (0, validation_js_1.validateAnimeList)(animeListWithDuplicateIds);
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('重复'))).toBe(true);
        });
    });
});
// 简单的测试运行器实现
function describe(name, fn) {
    console.log(`\n${name}`);
    fn();
}
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
    }
    catch (error) {
        console.log(`  ❌ ${name}: ${error.message}`);
    }
}
function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`);
            }
        },
        toHaveLength(expected) {
            if (value.length !== expected) {
                throw new Error(`Expected length ${expected}, got ${value.length}`);
            }
        },
        toContain(expected) {
            if (!value.includes(expected)) {
                throw new Error(`Expected to contain "${expected}"`);
            }
        },
        toBeGreaterThan(expected) {
            if (value <= expected) {
                throw new Error(`Expected ${value} to be greater than ${expected}`);
            }
        }
    };
}
// 运行测试
console.log('=== 运行Jest风格的表单验证测试 ===');
describe('表单验证工具', () => {
    describe('Anime数据验证', () => {
        test('验证有效的Anime数据应该通过', () => {
            const validAnime = {
                id: 'test-id-123',
                title: '测试动漫',
                watchMethod: '在线观看',
                description: '这是一个测试动漫',
                tags: ['动作', '冒险'],
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(validAnime);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        test('验证缺少id字段的Anime数据应该失败', () => {
            const invalidAnime = {
                title: '测试动漫',
                watchMethod: '在线观看',
                episodes: [],
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };
            const result = (0, validation_js_1.validateAnime)(invalidAnime);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('id不能为空');
        });
    });
    describe('Episode数据验证', () => {
        test('验证有效的Episode数据应该通过', () => {
            const validEpisode = {
                id: 'episode-123',
                number: 1,
                title: '第一集',
                url: 'https://example.com/episode1',
                watched: false,
                notes: '测试笔记'
            };
            const result = (0, validation_js_1.validateEpisode)(validEpisode);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        test('验证无效剧集编号的Episode数据应该失败', () => {
            const invalidEpisode = {
                id: 'episode-123',
                number: -1,
                title: '第一集',
                url: 'https://example.com/episode1',
                watched: false
            };
            const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('剧集编号必须大于0');
        });
    });
});
console.log('\n=== 测试完成 ===');
