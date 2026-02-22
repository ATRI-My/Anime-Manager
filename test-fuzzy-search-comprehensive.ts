// fuzzySearch函数全面测试
import { fuzzySearch } from './src/shared/utils';
import { Anime } from './src/shared/types';

// 全面的测试数据
const comprehensiveTestData: Anime[] = [
  // 基础测试数据
  {
    id: '1',
    title: '火影忍者 Naruto',
    tags: ['动作', '冒险', '忍者', '热血', '少年'],
    description: '忍者成长故事，讲述鸣人的冒险',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: '海贼王 One Piece',
    tags: ['动作', '冒险', '海盗', '热血', '少年'],
    description: '海盗冒险故事，寻找One Piece',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: '3',
    title: '进击的巨人 Attack on Titan',
    tags: ['动作', '黑暗', '奇幻', '悬疑', '战争'],
    description: '巨人与人类战斗的黑暗故事',
    watchMethod: 'download',
    episodes: [],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    id: '4',
    title: '鬼灭之刃 Demon Slayer',
    tags: ['动作', '奇幻', '热血', '剑术', '时代剧'],
    description: '鬼杀队使用剑术战斗的故事',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04'
  },
  {
    id: '5',
    title: '间谍过家家 Spy x Family',
    tags: ['喜剧', '家庭', '间谍', '日常', '温馨'],
    description: '间谍组建家庭的搞笑日常故事',
    watchMethod: 'online',
    episodes: [],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  // 边界情况测试数据
  {
    id: '6',
    title: '测试动漫 - 空标签',
    tags: [],
    description: '这是一个测试描述',
    watchMethod: 'other',
    episodes: [],
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06'
  },
  {
    id: '7',
    title: '测试动漫 - 空描述',
    tags: ['测试', '示例'],
    description: '',
    watchMethod: 'other',
    episodes: [],
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07'
  },
  {
    id: '8',
    title: '特殊字符测试',
    tags: ['动作-冒险', '科幻/奇幻', '测试_tag'],
    description: '包含特殊字符的描述：test-data',
    watchMethod: 'other',
    episodes: [],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  }
];

console.log('=== fuzzySearch函数全面测试 ===\n');
console.log(`测试数据: ${comprehensiveTestData.length} 部动漫\n`);

let passedTests = 0;
let totalTests = 0;

function runTest(description: string, query: string, expectedCount: number, expectedTitles?: string[]) {
  totalTests++;
  const result = fuzzySearch(query, comprehensiveTestData);
  const passed = result.length === expectedCount;
  
  if (passed && expectedTitles) {
    const resultTitles = result.map(a => a.title);
    const titlesMatch = expectedTitles.every(title => resultTitles.includes(title)) && 
                       resultTitles.length === expectedTitles.length;
    if (!titlesMatch) {
      console.log(`${description}: ❌ 数量正确但标题不匹配`);
      console.log(`  预期标题: ${expectedTitles.join(', ')}`);
      console.log(`  实际标题: ${resultTitles.join(', ')}`);
      return;
    }
  }
  
  console.log(`${description}: ${passed ? '✅' : '❌'}`);
  if (!passed) {
    console.log(`  查询: "${query}"`);
    console.log(`  预期: ${expectedCount} 部, 实际: ${result.length} 部`);
  }
  
  if (passed) passedTests++;
}

// === 基础功能测试 ===
console.log('1. 基础功能测试');
runTest('  1.1 空查询', '', 8);
runTest('  1.2 单词语义 - 标题', '火影', 1, ['火影忍者 Naruto']);
runTest('  1.3 单词语义 - 标签', '动作', 5); // 前5部都有动作标签
runTest('  1.4 单词语义 - 描述', '故事', 5); // 前5部描述包含"故事"
runTest('  1.5 大小写不敏感', 'NARUTO', 1, ['火影忍者 Naruto']);
runTest('  1.6 不存在的搜索', '不存在的内容', 0);

// === 标签组合搜索测试 ===
console.log('\n2. 标签组合搜索测试');
runTest('  2.1 双标签AND搜索', '动作 冒险', 3, ['火影忍者 Naruto', '海贼王 One Piece', '特殊字符测试']);
runTest('  2.2 三标签AND搜索', '动作 热血 少年', 2, ['火影忍者 Naruto', '海贼王 One Piece']);
runTest('  2.3 部分匹配', '动作 黑暗', 1, ['进击的巨人 Attack on Titan']);
runTest('  2.4 无匹配标签组合', '动作 喜剧', 0);
runTest('  2.5 包含特殊字符的标签', '动作-冒险', 1, ['特殊字符测试']);

// === 混合搜索测试 ===
console.log('\n3. 混合搜索测试');
runTest('  3.1 标题匹配优先', '海贼 动作', 1, ['海贼王 One Piece']);
runTest('  3.2 描述匹配', '成长 冒险', 1, ['火影忍者 Naruto']);
runTest('  3.3 标题+标签混合', '鬼灭 剑术', 1, ['鬼灭之刃 Demon Slayer']);
runTest('  3.4 多词在描述中', '战斗 故事', 2); // 巨人、鬼灭

// === 边界情况测试 ===
console.log('\n4. 边界情况测试');
runTest('  4.1 多余空格处理', '   动作   冒险   ', 3);
runTest('  4.2 多个连续空格', '动作　　冒险', 3); // 使用全角空格测试
runTest('  4.3 空标签动漫搜索', '测试', 3); // 第6部(描述)、第7部(标签)、第8部(标签)
runTest('  4.4 空描述动漫搜索', '示例', 1, ['测试动漫 - 空描述']);
runTest('  4.5 特殊字符查询', 'test-data', 1, ['特殊字符测试']);
runTest('  4.6 单个字符搜索', '动', 7); // 标题包含"动"字的所有动漫

// === 性能测试 ===
console.log('\n5. 性能测试');
const performanceTestStart = performance.now();
const iterations = 1000;
let totalMatches = 0;

for (let i = 0; i < iterations; i++) {
  // 测试不同类型的查询
  totalMatches += fuzzySearch('动作 冒险', comprehensiveTestData).length;
  totalMatches += fuzzySearch('火影', comprehensiveTestData).length;
  totalMatches += fuzzySearch('故事', comprehensiveTestData).length;
  totalMatches += fuzzySearch('不存在的搜索', comprehensiveTestData).length;
}

const performanceTestEnd = performance.now();
const performanceTime = performanceTestEnd - performanceTestStart;
const avgTime = performanceTime / (iterations * 4);

console.log(`  5.1 ${iterations * 4}次搜索总耗时: ${performanceTime.toFixed(2)}ms`);
console.log(`  5.2 平均每次搜索耗时: ${avgTime.toFixed(4)}ms`);
console.log(`  5.3 总匹配次数: ${totalMatches}`);

// 性能基准：平均每次搜索应小于0.1ms
const performancePassed = avgTime < 0.1;
console.log(`  5.4 性能测试: ${performancePassed ? '✅' : '⚠️'} (基准: <0.1ms/次)`);
if (performancePassed) passedTests++;
totalTests++;

// === 总结 ===
console.log('\n=== 测试总结 ===');
console.log(`通过测试: ${passedTests}/${totalTests}`);
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 所有测试通过！fuzzySearch函数功能完整。');
} else {
  console.log('\n⚠️  有测试未通过，请检查实现。');
}

// 导出测试函数供其他测试使用
export function runFuzzySearchTests() {
  console.log('运行fuzzySearch测试...');
  // 这里可以添加更多的测试逻辑
}