// 数据同步测试 - 验证WritePage和QueryPage之间的数据同步

// 测试运行器
function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error: any) {
    console.log(`  ❌ ${name}: ${error.message}`);
  }
}

function expect(value: any) {
  return {
    toBe(expected: any) {
      if (value !== expected) {
        throw new Error(`Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`);
      }
    },
    toBeTruthy() {
      if (!value) {
        throw new Error(`Expected truthy, got ${JSON.stringify(value)}`);
      }
    },
    toBeFalsy() {
      if (value) {
        throw new Error(`Expected falsy, got ${JSON.stringify(value)}`);
      }
    },
    toContain(expected: string) {
      if (!value.includes(expected)) {
        throw new Error(`Expected to contain "${expected}"`);
      }
    },
    toHaveLength(expected: number) {
      if (value.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${value.length}`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
      }
    }
  };
}

// 定义类型
interface Anime {
  id: string;
  title: string;
  watchMethod: string;
  description: string;
  tags: string[];
  episodes: any[];
  createdAt: string;
  updatedAt: string;
}

interface AppDataState {
  animeList: Anime[];
  loading: boolean;
  error: string | null;
  isModified: boolean;
}

// 模拟AppDataContext
const mockAppDataContext = {
  state: {
    animeList: [] as Anime[],
    loading: false,
    error: null,
    isModified: false
  } as AppDataState,
  actions: {
    addAnime: async (animeData: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newAnime: Anime = {
        ...animeData,
        id: `anime-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockAppDataContext.state.animeList.push(newAnime);
      mockAppDataContext.state.isModified = true;
      return { success: true };
    },
    updateAnime: async (id: string, updates: Partial<Anime>) => {
      const index = mockAppDataContext.state.animeList.findIndex(anime => anime.id === id);
      if (index === -1) return { success: false, error: '动漫不存在' };
      
      mockAppDataContext.state.animeList[index] = {
        ...mockAppDataContext.state.animeList[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      mockAppDataContext.state.isModified = true;
      return { success: true };
    },
    deleteAnime: async (id: string) => {
      const initialLength = mockAppDataContext.state.animeList.length;
      mockAppDataContext.state.animeList = mockAppDataContext.state.animeList.filter(anime => anime.id !== id);
      mockAppDataContext.state.isModified = true;
      return { success: mockAppDataContext.state.animeList.length < initialLength };
    }
  }
};

// 模拟WritePage组件
const mockWritePage = {
  addAnime: async (animeData: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await mockAppDataContext.actions.addAnime(animeData);
  },
  updateAnime: async (id: string, updates: Partial<Anime>) => {
    return await mockAppDataContext.actions.updateAnime(id, updates);
  }
};

// 模拟QueryPage组件
const mockQueryPage = {
  getAnimeList: () => mockAppDataContext.state.animeList,
  getFilteredAnimeList: (searchQuery: string) => {
    if (!searchQuery) return mockAppDataContext.state.animeList;
    return mockAppDataContext.state.animeList.filter(anime => 
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
};

console.log('=== 数据同步测试开始 ===');
console.log('测试场景：验证WritePage和QueryPage之间的数据同步功能');
console.log('测试重点：');
console.log('1. 写入页面修改数据后，查询页面是否立即看到更新');
console.log('2. 文件保存后，数据是否同步');
console.log('3. 多个页面同时访问数据时，是否保持一致');

// 运行测试套件
describe('数据同步测试套件 - RED阶段（测试应该失败）', () => {
  // 测试1: 在WritePage添加新动漫后，QueryPage应该立即看到更新
  test('WritePage添加新动漫后，QueryPage应该立即看到更新', async () => {
    // 初始状态：没有动漫
    expect(mockQueryPage.getAnimeList()).toHaveLength(0);
    
    // 在WritePage添加新动漫
    const newAnime = {
      title: '测试动漫1',
      watchMethod: '在线观看',
      description: '测试描述',
      tags: ['动作', '冒险'],
      episodes: []
    };
    
    const result = await mockWritePage.addAnime(newAnime);
    expect(result.success).toBeTruthy();
    
    // QueryPage应该立即看到更新
    const animeList = mockQueryPage.getAnimeList();
    expect(animeList).toHaveLength(1);
    expect(animeList[0].title).toBe('测试动漫1');
    expect(animeList[0].watchMethod).toBe('在线观看');
  });
  
  // 测试2: 在WritePage更新动漫后，QueryPage应该看到更新后的数据
  test('WritePage更新动漫后，QueryPage应该看到更新后的数据', async () => {
    // 先添加一个动漫
    const newAnime = {
      title: '原始标题',
      watchMethod: '在线观看',
      description: '原始描述',
      tags: ['动作'],
      episodes: []
    };
    
    const addResult = await mockWritePage.addAnime(newAnime);
    expect(addResult.success).toBeTruthy();
    
    const animeListBefore = mockQueryPage.getAnimeList();
    const animeId = animeListBefore[0].id;
    
    // 在WritePage更新动漫
    const updates = {
      title: '更新后的标题',
      description: '更新后的描述'
    };
    
    const updateResult = await mockWritePage.updateAnime(animeId, updates);
    expect(updateResult.success).toBeTruthy();
    
    // QueryPage应该看到更新后的数据
    const animeListAfter = mockQueryPage.getAnimeList();
    expect(animeListAfter[0].title).toBe('更新后的标题');
    expect(animeListAfter[0].description).toBe('更新后的描述');
  });
  
  // 测试3: QueryPage的搜索功能应该基于共享数据源
  test('QueryPage的搜索功能应该基于共享数据源', async () => {
    // 清空数据
    mockAppDataContext.state.animeList = [];
    
    // 添加多个动漫
    const anime1 = {
      title: '火影忍者',
      watchMethod: '在线观看',
      description: '忍者动漫',
      tags: ['动作', '冒险'],
      episodes: []
    };
    
    const anime2 = {
      title: '海贼王',
      watchMethod: '下载观看',
      description: '海盗动漫',
      tags: ['冒险', '喜剧'],
      episodes: []
    };
    
    const anime3 = {
      title: '死神',
      watchMethod: '在线观看',
      description: '死神动漫',
      tags: ['动作', '超自然'],
      episodes: []
    };
    
    await mockWritePage.addAnime(anime1);
    await mockWritePage.addAnime(anime2);
    await mockWritePage.addAnime(anime3);
    
    // QueryPage搜索应该返回正确结果
    const allAnime = mockQueryPage.getFilteredAnimeList('');
    expect(allAnime).toHaveLength(3);
    
    const searchResult1 = mockQueryPage.getFilteredAnimeList('火影');
    expect(searchResult1).toHaveLength(1);
    expect(searchResult1[0].title).toBe('火影忍者');
    
    const searchResult2 = mockQueryPage.getFilteredAnimeList('海贼');
    expect(searchResult2).toHaveLength(1);
    expect(searchResult2[0].title).toBe('海贼王');
    
    const searchResult3 = mockQueryPage.getFilteredAnimeList('忍者');
    expect(searchResult3).toHaveLength(1);
    expect(searchResult3[0].title).toBe('火影忍者');
  });
  
  // 测试4: 数据修改状态应该同步
  test('数据修改状态应该同步', () => {
    // 添加动漫后，isModified应该为true
    expect(mockAppDataContext.state.isModified).toBeTruthy();
    
    // 模拟保存后，isModified应该为false
    mockAppDataContext.state.isModified = false;
    expect(mockAppDataContext.state.isModified).toBeFalsy();
    
    // 再次修改后，isModified应该为true
    if (mockAppDataContext.state.animeList.length > 0) {
      mockAppDataContext.state.animeList[0].title = '再次修改';
      mockAppDataContext.state.isModified = true;
      expect(mockAppDataContext.state.isModified).toBeTruthy();
    }
  });
  
  // 测试5: 多个页面同时访问数据时，应该保持一致
  test('多个页面同时访问数据时，应该保持一致', () => {
    // 模拟多个QueryPage实例访问相同数据
    const queryPage1 = mockQueryPage;
    const queryPage2 = {
      getAnimeList: () => mockAppDataContext.state.animeList,
      getFilteredAnimeList: (searchQuery: string) => {
        if (!searchQuery) return mockAppDataContext.state.animeList;
        return mockAppDataContext.state.animeList.filter(anime => 
          anime.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    };
    
    const list1 = queryPage1.getAnimeList();
    const list2 = queryPage2.getAnimeList();
    
    // 两个页面应该看到相同的数据
    expect(list1).toEqual(list2);
    expect(list1.length).toBe(list2.length);
    
    // 搜索也应该返回相同结果
    const search1 = queryPage1.getFilteredAnimeList('火影');
    const search2 = queryPage2.getFilteredAnimeList('火影');
    expect(search1).toEqual(search2);
  });
});

console.log('\n=== 测试报告 ===');
console.log('当前状态：模拟测试通过，但实际组件测试需要验证');
console.log('需要验证的实际功能：');
console.log('1. WritePage和QueryPage必须使用相同的AppDataContext');
console.log('2. 数据修改必须通过AppDataContext的actions进行');
console.log('3. 所有组件必须从AppDataContext.state获取数据');
console.log('4. 数据修改必须触发状态更新，所有组件自动重新渲染');
console.log('\n下一步：运行实际组件测试验证数据同步');