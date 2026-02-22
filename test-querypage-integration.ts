// QueryPage集成测试 - 模拟fuzzySearch在QueryPage中的使用
import { fuzzySearch } from './src/shared/utils';
import { Anime } from './src/shared/types';

// 模拟QueryPage中的搜索逻辑
function simulateQueryPageSearch(searchQuery: string, animeList: Anime[]) {
  // QueryPage中使用useMemo包装fuzzySearch
  return fuzzySearch(searchQuery, animeList);
}

// 测试数据 - 模拟真实动漫数据
const mockAnimeList: Anime[] = [
  {
    id: '1',
    title: 'Naruto: Shippuden',
    tags: ['动作', '冒险', '忍者', '热血', '少年'],
    description: '鸣人成为忍者的成长故事',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'One Piece',
    tags: ['动作', '冒险', '海盗', '热血', '少年'],
    description: '路飞寻找One Piece的冒险',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: '3',
    title: 'Attack on Titan',
    tags: ['动作', '黑暗', '奇幻', '战争', '悬疑'],
    description: '人类与巨人的生存战争',
    watchMethod: 'download',
    episodes: [],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    id: '4',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    tags: ['动作', '奇幻', '剑术', '时代剧', '热血'],
    description: '炭治郎成为鬼杀队剑士的故事',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04'
  },
  {
    id: '5',
    title: 'Spy x Family',
    tags: ['喜剧', '家庭', '间谍', '日常', '温馨'],
    description: '间谍组建家庭的搞笑日常',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
];

console.log('=== QueryPage集成测试 ===\n');
console.log(`模拟动漫数据: ${mockAnimeList.length} 部\n`);

// 测试QueryPage中常见的搜索场景
const testScenarios = [
  { query: '', description: '空查询 - 显示所有动漫', expected: 5 },
  { query: 'naruto', description: '英文标题搜索', expected: 1 },
  { query: '动作', description: '标签搜索', expected: 4 },
  { query: '故事', description: '描述搜索', expected: 2 },
  { query: 'a', description: '单字符搜索', expected: 4 }, // Naruto, Attack, Demon Slayer, Spy x Family
  { query: '动作 热血 少年', description: '三标签组合搜索', expected: 2 }
];

let passedTests = 0;
let totalTests = testScenarios.length;

testScenarios.forEach((scenario, index) => {
  const result = simulateQueryPageSearch(scenario.query, mockAnimeList);
  const passed = result.length === scenario.expected;
  
  console.log(`测试 ${index + 1}: ${scenario.description}`);
  console.log(`  查询: "${scenario.query}"`);
  console.log(`  预期: ${scenario.expected} 部, 实际: ${result.length} 部`);
  
  if (passed) {
    console.log(`  结果: ✅ 通过`);
    passedTests++;
  } else {
    console.log(`  结果: ❌ 失败`);
    if (result.length > 0) {
      console.log(`  匹配动漫: ${result.map(a => a.title).join(', ')}`);
    }
  }
  console.log();
});

// 性能测试 - 模拟QueryPage中的频繁搜索
console.log('=== 性能测试 ===');
const performanceIterations = 1000;
const startTime = performance.now();

let totalMatches = 0;
for (let i = 0; i < performanceIterations; i++) {
  // 模拟用户输入不同查询
  totalMatches += simulateQueryPageSearch('动作', mockAnimeList).length;
  totalMatches += simulateQueryPageSearch('动作 冒险', mockAnimeList).length;
  totalMatches += simulateQueryPageSearch('', mockAnimeList).length;
  totalMatches += simulateQueryPageSearch('不存在的', mockAnimeList).length;
}

const endTime = performance.now();
const totalTime = endTime - startTime;
const searchesCount = performanceIterations * 4;
const avgTimePerSearch = totalTime / searchesCount;

console.log(`模拟 ${searchesCount} 次搜索（${performanceIterations}个用户会话）:`);
console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
console.log(`平均每次搜索耗时: ${avgTimePerSearch.toFixed(4)}ms`);
console.log(`总匹配次数: ${totalMatches}`);
console.log(`性能: ${avgTimePerSearch < 0.1 ? '✅ 优秀' : '⚠️  需优化'}`);

// 总结
console.log('\n=== 集成测试总结 ===');
console.log(`通过测试: ${passedTests}/${totalTests}`);
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests && avgTimePerSearch < 0.1) {
  console.log('\n🎉 集成测试通过！fuzzySearch在QueryPage中工作正常，性能优秀。');
} else {
  console.log('\n⚠️  集成测试未完全通过，请检查问题。');
}

// 导出模拟函数供其他测试使用
export { simulateQueryPageSearch };