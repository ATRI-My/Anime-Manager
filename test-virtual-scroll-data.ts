import { Anime, Episode } from './src/shared/types'

// 生成测试动漫数据
export function generateTestAnimeData(count: number): Anime[] {
  const animeList: Anime[] = []
  
  for (let i = 1; i <= count; i++) {
    const anime: Anime = {
      id: `anime-${i}`,
      title: `测试动漫 ${i}`,
      watchMethod: i % 3 === 0 ? '本地播放器' : i % 3 === 1 ? '在线观看' : '下载观看',
      description: `这是第 ${i} 个测试动漫的描述，用于测试虚拟滚动功能。`,
      episodes: generateTestEpisodes(Math.floor(Math.random() * 20) + 10),
      tags: ['测试', '虚拟滚动', `标签${i % 5 + 1}`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    animeList.push(anime)
  }
  
  return animeList
}

// 生成测试剧集数据
export function generateTestEpisodes(count: number): Episode[] {
  const episodes: Episode[] = []
  
  for (let i = 1; i <= count; i++) {
    const episode: Episode = {
      id: `episode-${i}`,
      number: i,
      title: `第 ${i} 集 - 测试剧集标题`,
      url: `https://example.com/episode/${i}`,
      watched: i % 3 === 0 // 每3集有一个已观看
    }
    episodes.push(episode)
  }
  
  return episodes
}

// 测试虚拟滚动阈值逻辑
export function testVirtualizationThresholds() {
  console.log('=== 虚拟滚动阈值测试 ===')
  
  const thresholds = {
    animeGrid: 20,
    episodeList: 50
  }
  
  // 测试动漫网格阈值
  console.log('\n动漫网格阈值测试:')
  console.log(`阈值: ${thresholds.animeGrid}`)
  
  const testCases = [10, 20, 21, 50, 100]
  testCases.forEach(count => {
    const shouldVirtualize = count > thresholds.animeGrid
    console.log(`动漫数量 ${count}: ${shouldVirtualize ? '使用虚拟化' : '不使用虚拟化'}`)
  })
  
  // 测试剧集列表阈值
  console.log('\n剧集列表阈值测试:')
  console.log(`阈值: ${thresholds.episodeList}`)
  
  const episodeTestCases = [30, 50, 51, 100, 200]
  episodeTestCases.forEach(count => {
    const shouldVirtualize = count > thresholds.episodeList
    console.log(`剧集数量 ${count}: ${shouldVirtualize ? '使用虚拟化' : '不使用虚拟化'}`)
  })
  
  console.log('\n=== 测试完成 ===')
}

// 生成性能测试数据
export function generatePerformanceTestData() {
  console.log('=== 性能测试数据生成 ===')
  
  // 小数据集 - 低于阈值
  const smallAnimeList = generateTestAnimeData(15)
  const smallEpisodeList = generateTestEpisodes(40)
  
  // 大数据集 - 高于阈值
  const largeAnimeList = generateTestAnimeData(100)
  const largeEpisodeList = generateTestEpisodes(200)
  
  console.log(`小数据集: ${smallAnimeList.length} 个动漫, ${smallEpisodeList.length} 个剧集`)
  console.log(`大数据集: ${largeAnimeList.length} 个动漫, ${largeEpisodeList.length} 个剧集`)
  
  return {
    smallAnimeList,
    smallEpisodeList,
    largeAnimeList,
    largeEpisodeList
  }
}

// 运行测试
if (require.main === module) {
  testVirtualizationThresholds()
  
  const testData = generatePerformanceTestData()
  console.log('\n测试数据已生成，可用于验证虚拟滚动功能')
  
  // 验证虚拟滚动工具函数
  console.log('\n=== 虚拟滚动工具函数验证 ===')
  
  // 模拟 shouldUseVirtualization 函数
  function shouldUseVirtualization(itemCount: number, threshold: number, enabled: boolean = true): boolean {
    return enabled && itemCount > threshold
  }
  
  // 测试动漫网格
  console.log('\n动漫网格虚拟化检查:')
  console.log(`15个动漫 (阈值20): ${shouldUseVirtualization(15, 20) ? '虚拟化' : '不虚拟化'}`)
  console.log(`25个动漫 (阈值20): ${shouldUseVirtualization(25, 20) ? '虚拟化' : '不虚拟化'}`)
  console.log(`100个动漫 (阈值20): ${shouldUseVirtualization(100, 20) ? '虚拟化' : '不虚拟化'}`)
  
  // 测试剧集列表
  console.log('\n剧集列表虚拟化检查:')
  console.log(`40个剧集 (阈值50): ${shouldUseVirtualization(40, 50) ? '虚拟化' : '不虚拟化'}`)
  console.log(`60个剧集 (阈值50): ${shouldUseVirtualization(60, 50) ? '虚拟化' : '不虚拟化'}`)
  console.log(`200个剧集 (阈值50): ${shouldUseVirtualization(200, 50) ? '虚拟化' : '不虚拟化'}`)
}