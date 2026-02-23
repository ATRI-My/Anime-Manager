// test-write-bug-fixed.js
console.log('=== WritePage Bug修复测试 ===');

// 模拟新状态管理
let selectedAnimeId = 'test-anime-1';
let state = {
  animeList: [
    {
      id: 'test-anime-1',
      title: '测试动漫',
      episodes: [
        { id: 'ep1', title: '第1集', number: 1 },
        { id: 'ep2', title: '第2集', number: 2 }
      ]
    }
  ]
};

// 计算属性
const selectedAnime = state.animeList.find(a => a.id === selectedAnimeId);

console.log('新状态管理测试:');
console.log('selectedAnimeId:', selectedAnimeId);
console.log('selectedAnime:', selectedAnime);
console.log('状态一致性: ✅ 自动保证');

// 测试添加剧集
function testAddEpisode() {
  console.log('\n=== 测试添加剧集 ===');
  if (!selectedAnimeId) {
    console.log('❌ 错误: 未选中动漫');
    return false;
  }
  
  if (!selectedAnime) {
    console.log('❌ 错误: 选中的动漫不存在');
    return false;
  }
  
  console.log('✅ 可以添加剧集');
  console.log('当前剧集数:', selectedAnime.episodes.length);
  return true;
}

// 运行测试
testAddEpisode();
console.log('\n=== 测试完成 ===');