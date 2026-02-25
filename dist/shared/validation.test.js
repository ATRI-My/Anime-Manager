"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
const validation_js_1 = require("./validation.js");
// 运行所有测试
function runAllTests() {
    console.log('=== 开始运行表单验证测试 ===\n');
    let passed = 0;
    let failed = 0;
    // 测试1: 验证有效的Anime数据结构
    console.log('=== 测试1: 验证有效的Anime数据 ===');
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
    try {
        const result = (0, validation_js_1.validateAnime)(validAnime);
        if (result.isValid && result.errors.length === 0) {
            console.log('✅ 测试1通过: 有效的Anime数据验证成功');
            passed++;
        }
        else {
            console.log(`❌ 测试1失败: 预期验证通过，得到错误: ${JSON.stringify(result.errors)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试1失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试2: 验证缺少必填字段的Anime数据
    console.log('\n=== 测试2: 验证缺少必填字段的Anime数据 ===');
    const invalidAnime = {
        // 缺少id
        title: '测试动漫',
        watchMethod: '在线观看',
        episodes: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    };
    try {
        const result = (0, validation_js_1.validateAnime)(invalidAnime);
        if (!result.isValid && result.errors.some(e => e.includes('id'))) {
            console.log('✅ 测试2通过: 缺少id字段的Anime数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试2失败: 预期验证失败包含id错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试2失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试3: 验证空标题的Anime数据
    console.log('\n=== 测试3: 验证空标题的Anime数据 ===');
    const animeWithEmptyTitle = {
        id: 'test-id-123',
        title: '', // 空标题
        watchMethod: '在线观看',
        tags: [],
        episodes: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    };
    try {
        const result = (0, validation_js_1.validateAnime)(animeWithEmptyTitle);
        if (!result.isValid && result.errors.some(e => e.includes('标题'))) {
            console.log('✅ 测试3通过: 空标题的Anime数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试3失败: 预期验证失败包含标题错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试3失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试4: 验证有效的Episode数据结构
    console.log('\n=== 测试4: 验证有效的Episode数据 ===');
    const validEpisode = {
        id: 'episode-123',
        number: 1,
        title: '第一集',
        url: 'https://example.com/episode1',
        watched: false,
        notes: '测试笔记'
    };
    try {
        const result = (0, validation_js_1.validateEpisode)(validEpisode);
        if (result.isValid && result.errors.length === 0) {
            console.log('✅ 测试4通过: 有效的Episode数据验证成功');
            passed++;
        }
        else {
            console.log(`❌ 测试4失败: 预期验证通过，得到错误: ${JSON.stringify(result.errors)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试4失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试5: 验证无效剧集编号的Episode数据
    console.log('\n=== 测试5: 验证无效剧集编号的Episode数据 ===');
    const invalidEpisode = {
        id: 'episode-123',
        number: -1, // 负数
        title: '第一集',
        url: 'https://example.com/episode1',
        watched: false
    };
    try {
        const result = (0, validation_js_1.validateEpisode)(invalidEpisode);
        if (!result.isValid && result.errors.some(e => e.includes('大于0'))) {
            console.log('✅ 测试5通过: 无效剧集编号的Episode数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试5失败: 预期验证失败包含剧集编号错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试5失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试6: 验证无效URL的Episode数据
    console.log('\n=== 测试6: 验证无效URL的Episode数据 ===');
    const episodeWithInvalidUrl = {
        id: 'episode-123',
        number: 1,
        title: '第一集',
        url: '不是有效的URL', // 无效URL
        watched: false
    };
    try {
        const result = (0, validation_js_1.validateEpisode)(episodeWithInvalidUrl);
        if (!result.isValid && result.errors.some(e => e.includes('URL'))) {
            console.log('✅ 测试6通过: 无效URL的Episode数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试6失败: 预期验证失败包含URL错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试6失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试7: 验证Anime包含无效Episode数据
    console.log('\n=== 测试7: 验证Anime包含无效Episode数据 ===');
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
                url: '无效URL', // 无效URL
                watched: false
            }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    };
    try {
        const result = (0, validation_js_1.validateAnime)(animeWithInvalidEpisode);
        if (!result.isValid && result.errors.some(e => e.includes('episodes包含无效数据'))) {
            console.log('✅ 测试7通过: 包含无效Episode的Anime数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试7失败: 预期验证失败包含episodes错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试7失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试8: 验证Anime包含重复剧集编号
    console.log('\n=== 测试8: 验证Anime包含重复剧集编号 ===');
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
                number: 1, // 重复的剧集编号
                title: '另一个第一集',
                url: 'https://example.com/episode1-dup',
                watched: false
            }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
    };
    try {
        const result = (0, validation_js_1.validateAnime)(animeWithDuplicateEpisodes);
        if (!result.isValid && result.errors.some(e => e.includes('重复'))) {
            console.log('✅ 测试8通过: 包含重复剧集编号的Anime数据验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试8失败: 预期验证失败包含重复错误，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试8失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    // 测试9: 验证Anime列表
    console.log('\n=== 测试9: 验证Anime列表 ===');
    const animeList = [
        validAnime,
        animeWithInvalidEpisode // 这个应该使验证失败
    ];
    try {
        const result = (0, validation_js_1.validateAnimeList)(animeList);
        if (!result.isValid) {
            console.log('✅ 测试9通过: 包含无效Anime的列表验证失败');
            passed++;
        }
        else {
            console.log(`❌ 测试9失败: 预期验证失败，得到: ${JSON.stringify(result)}`);
            failed++;
        }
    }
    catch (error) {
        console.log(`❌ 测试9失败: 函数抛出异常: ${error.message}`);
        failed++;
    }
    console.log('\n=== 测试结果汇总 ===');
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`总计: ${passed + failed}`);
    if (failed > 0) {
        console.log('\n⚠️  注意：所有测试都应该在RED阶段失败，这是TDD的正常过程');
        console.log('下一步是实现验证函数，使测试通过（GREEN阶段）');
    }
}
// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runAllTests();
}
