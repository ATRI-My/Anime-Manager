// WritePage bug测试脚本
console.log('=== WritePage Bug测试 ===');

// 模拟WritePage的状态
let selectedAnime = {
  id: 'test-anime-1',
  title: '测试动漫',
  episodes: [
    { id: 'ep1', title: '第1集', number: 1 },
    { id: 'ep2', title: '第2集', number: 2 }
  ]
};

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

// 模拟deleteEpisode函数
function mockDeleteEpisode(animeId, episodeId) {
  console.log(`删除剧集: animeId=${animeId}, episodeId=${episodeId}`);
  
  // 模拟异步状态更新
  return new Promise(resolve => {
    setTimeout(() => {
      // 更新全局状态
      const animeIndex = state.animeList.findIndex(a => a.id === animeId);
      if (animeIndex !== -1) {
        const updatedEpisodes = state.animeList[animeIndex].episodes.filter(ep => ep.id !== episodeId);
        state.animeList[animeIndex] = {
          ...state.animeList[animeIndex],
          episodes: updatedEpisodes
        };
      }
      
      resolve({
        success: true,
        updatedAnime: state.animeList.find(a => a.id === animeId)
      });
    }, 0); // 模拟React的异步更新
  });
}

// 模拟handleDeleteEpisode函数（简化版）
async function testHandleDeleteEpisode() {
  console.log('\n=== 测试删除剧集 ===');
  console.log('删除前 selectedAnime:', selectedAnime);
  console.log('删除前 state.animeList:', state.animeList);
  
  const result = await mockDeleteEpisode(selectedAnime.id, 'ep1');
  
  if (result.success) {
    // 问题点：这里可能发生状态不一致
    if (result.updatedAnime) {
      selectedAnime = result.updatedAnime;
      console.log('使用result.updatedAnime更新selectedAnime');
    } else {
      // 回退逻辑 - 这里可能有问题
      const updatedAnime = state.animeList.find(a => a.id === selectedAnime.id);
      selectedAnime = updatedAnime || null;
      console.log('使用state.animeList查找更新selectedAnime:', !!updatedAnime);
    }
  }
  
  console.log('删除后 selectedAnime:', selectedAnime);
  console.log('删除后 state.animeList:', state.animeList);
  
  // 检查状态一致性
  const isConsistent = JSON.stringify(selectedAnime) === JSON.stringify(state.animeList[0]);
  console.log(`状态一致性检查: ${isConsistent ? '✅ 一致' : '❌ 不一致'}`);
  
  return isConsistent;
}

// 模拟handleAddEpisode函数（简化版）
function testHandleAddEpisode() {
  console.log('\n=== 测试添加剧集 ===');
  console.log('添加前 selectedAnime:', selectedAnime);
  
  if (!selectedAnime) {
    console.log('❌ 错误: selectedAnime为null，无法添加剧集');
    return false;
  }
  
  console.log('✅ selectedAnime有效，可以添加剧集');
  return true;
}

// 运行测试
async function runTests() {
  console.log('\n--- 测试场景1: 正常删除后添加 ---');
  await testHandleDeleteEpisode();
  testHandleAddEpisode();
  
  console.log('\n--- 测试场景2: 模拟状态不一致 ---');
  // 重置状态
  selectedAnime = {
    id: 'test-anime-1',
    title: '测试动漫',
    episodes: [
      { id: 'ep1', title: '第1集', number: 1 },
      { id: 'ep2', title: '第2集', number: 2 }
    ]
  };
  
  state = {
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
  
  // 模拟状态不一致：selectedAnime指向旧对象
  await mockDeleteEpisode(selectedAnime.id, 'ep1');
  // 不更新selectedAnime，模拟状态不一致
  console.log('模拟状态不一致: selectedAnime未更新');
  console.log('selectedAnime:', selectedAnime);
  console.log('state.animeList:', state.animeList);
  
  const canAdd = testHandleAddEpisode();
  console.log(`添加剧集可行性: ${canAdd ? '✅ 可以添加' : '❌ 无法添加'}`);
  
  console.log('\n=== 测试完成 ===');
}

runTests().catch(console.error);