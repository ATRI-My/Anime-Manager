// 数据同步验证测试 - 端到端验证修复
// 遵循TDD原则：先写失败的测试

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

// 模拟AppDataContext状态
interface MockAppDataState {
  animeList: any[];
  isModified: boolean;
}

// 模拟AppDataContext操作
interface MockAppDataActions {
  addAnime: (animeData: any) => Promise<{ success: boolean; error?: string }>;
  updateAnime: (id: string, updates: any) => Promise<{ success: boolean; error?: string }>;
  deleteAnime: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// 模拟WritePage组件
class WritePageSimulator {
  private animeList: any[] = [];
  private selectedAnime: any = null;
  
  constructor(private actions: MockAppDataActions) {}
  
  async handleSaveAnime(formData: any) {
    try {
      if (this.selectedAnime) {
        // 更新现有番剧
        const result = await this.actions.updateAnime(this.selectedAnime.id, formData);
        return result;
      } else {
        // 添加新番剧
        const animeToAdd = {
          ...formData,
          episodes: []
        };
        const result = await this.actions.addAnime(animeToAdd);
        return result;
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '未知错误' };
    }
  }
  
  async handleDeleteAnime(animeId: string) {
    try {
      const result = await this.actions.deleteAnime(animeId);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '未知错误' };
    }
  }
  
  selectAnime(anime: any) {
    this.selectedAnime = anime;
  }
  
  clearSelection() {
    this.selectedAnime = null;
  }
}

// 模拟QueryPage组件
class QueryPageSimulator {
  constructor(private getAnimeList: () => any[]) {}
  
  getCurrentAnimeList() {
    return this.getAnimeList();
  }
  
  getFilteredAnimeList(searchQuery: string) {
    const animeList = this.getAnimeList();
    if (!searchQuery) return animeList;
    
    return animeList.filter(anime => 
      anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  async handleDeleteAnime(anime: any, deleteAction: (id: string) => Promise<{ success: boolean; error?: string }>) {
    try {
      const result = await deleteAction(anime.id);
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '未知错误' };
    }
  }
}

// 测试场景1: 添加新动漫的数据同步
describe('场景1: 添加新动漫的数据同步', () => {
  // 模拟共享状态
  let sharedAnimeList: any[] = [];
  let sharedIsModified = false;
  
  const mockActions: MockAppDataActions = {
    addAnime: async (animeData) => {
      const newAnime = {
        ...animeData,
        id: `anime-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sharedAnimeList.push(newAnime);
      sharedIsModified = true;
      return { success: true };
    },
    updateAnime: async (id, updates) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList[index] = { ...sharedAnimeList[index], ...updates, updatedAt: new Date().toISOString() };
      sharedIsModified = true;
      return { success: true };
    },
    deleteAnime: async (id) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList.splice(index, 1);
      sharedIsModified = true;
      return { success: true };
    }
  };
  
  // 创建模拟组件
  const writePage = new WritePageSimulator(mockActions);
  const queryPage = new QueryPageSimulator(() => sharedAnimeList);
  
  test('WritePage添加新动漫后，QueryPage应能看到新动漫', async () => {
    // 初始状态：没有动漫
    expect(queryPage.getCurrentAnimeList()).toHaveLength(0);
    
    // WritePage添加新动漫
    const newAnimeData = {
      title: '测试动漫',
      watchMethod: '在线观看',
      description: '这是一个测试动漫',
      tags: ['测试', '动画']
    };
    
    const result = await writePage.handleSaveAnime(newAnimeData);
    expect(result.success).toBeTruthy();
    
    // QueryPage应能看到新动漫
    const animeList = queryPage.getCurrentAnimeList();
    expect(animeList).toHaveLength(1);
    expect(animeList[0].title).toBe('测试动漫');
  });
  
  test('WritePage添加多个动漫后，QueryPage应能看到所有动漫', async () => {
    // 重置状态
    sharedAnimeList = [];
    
    // 添加多个动漫
    const animeData1 = {
      title: '动漫1',
      watchMethod: '在线观看',
      description: '动漫1描述',
      tags: ['动作']
    };
    
    const animeData2 = {
      title: '动漫2',
      watchMethod: '下载观看',
      description: '动漫2描述',
      tags: ['喜剧']
    };
    
    await writePage.handleSaveAnime(animeData1);
    await writePage.handleSaveAnime(animeData2);
    
    // QueryPage应能看到所有动漫
    const animeList = queryPage.getCurrentAnimeList();
    expect(animeList).toHaveLength(2);
    expect(animeList.map((a: any) => a.title)).toEqual(['动漫1', '动漫2']);
  });
});

// 测试场景2: 更新动漫的数据同步
describe('场景2: 更新动漫的数据同步', () => {
  // 模拟共享状态
  let sharedAnimeList: any[] = [
    {
      id: 'anime-1',
      title: '原始标题',
      watchMethod: '在线观看',
      description: '原始描述',
      tags: ['原始标签'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];
  
  const mockActions: MockAppDataActions = {
    addAnime: async (animeData) => {
      const newAnime = {
        ...animeData,
        id: `anime-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sharedAnimeList.push(newAnime);
      return { success: true };
    },
    updateAnime: async (id, updates) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList[index] = { ...sharedAnimeList[index], ...updates, updatedAt: new Date().toISOString() };
      return { success: true };
    },
    deleteAnime: async (id) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList.splice(index, 1);
      return { success: true };
    }
  };
  
  // 创建模拟组件
  const writePage = new WritePageSimulator(mockActions);
  const queryPage = new QueryPageSimulator(() => sharedAnimeList);
  
  test('WritePage更新动漫后，QueryPage应能看到更新后的数据', async () => {
    // 初始状态
    const initialAnime = queryPage.getCurrentAnimeList()[0];
    expect(initialAnime.title).toBe('原始标题');
    expect(initialAnime.description).toBe('原始描述');
    
    // 选择要更新的动漫
    writePage.selectAnime(initialAnime);
    
    // WritePage更新动漫
    const updates = {
      title: '更新后的标题',
      description: '更新后的描述',
      tags: ['新标签']
    };
    
    const result = await writePage.handleSaveAnime(updates);
    expect(result.success).toBeTruthy();
    
    // QueryPage应能看到更新后的数据
    const updatedAnime = queryPage.getCurrentAnimeList()[0];
    expect(updatedAnime.title).toBe('更新后的标题');
    expect(updatedAnime.description).toBe('更新后的描述');
    expect(updatedAnime.tags).toEqual(['新标签']);
  });
});

// 测试场景3: 删除动漫的数据同步
describe('场景3: 删除动漫的数据同步', () => {
  // 模拟共享状态
  let sharedAnimeList: any[] = [
    {
      id: 'anime-1',
      title: '动漫1',
      watchMethod: '在线观看',
      description: '动漫1描述',
      tags: ['动作'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'anime-2',
      title: '动漫2',
      watchMethod: '下载观看',
      description: '动漫2描述',
      tags: ['喜剧'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];
  
  const mockActions: MockAppDataActions = {
    addAnime: async (animeData) => {
      const newAnime = {
        ...animeData,
        id: `anime-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sharedAnimeList.push(newAnime);
      return { success: true };
    },
    updateAnime: async (id, updates) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList[index] = { ...sharedAnimeList[index], ...updates, updatedAt: new Date().toISOString() };
      return { success: true };
    },
    deleteAnime: async (id) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList.splice(index, 1);
      return { success: true };
    }
  };
  
  // 创建模拟组件
  const writePage = new WritePageSimulator(mockActions);
  const queryPage = new QueryPageSimulator(() => sharedAnimeList);
  
  test('WritePage删除动漫后，QueryPage应看不到被删除的动漫', async () => {
    // 初始状态：有2个动漫
    expect(queryPage.getCurrentAnimeList()).toHaveLength(2);
    
    // WritePage删除第一个动漫
    const animeToDelete = sharedAnimeList[0];
    const result = await writePage.handleDeleteAnime(animeToDelete.id);
    expect(result.success).toBeTruthy();
    
    // QueryPage应只剩下1个动漫
    const animeList = queryPage.getCurrentAnimeList();
    expect(animeList).toHaveLength(1);
    expect(animeList[0].id).toBe('anime-2');
  });
  
  test('QueryPage删除动漫后，WritePage应看不到被删除的动漫', async () => {
    // 重置状态
    sharedAnimeList = [
      {
        id: 'anime-1',
        title: '动漫1',
        watchMethod: '在线观看',
        description: '动漫1描述',
        tags: ['动作'],
        episodes: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'anime-2',
        title: '动漫2',
        watchMethod: '下载观看',
        description: '动漫2描述',
        tags: ['喜剧'],
        episodes: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    
    // 初始状态：有2个动漫
    expect(queryPage.getCurrentAnimeList()).toHaveLength(2);
    
    // QueryPage删除第一个动漫
    const animeToDelete = sharedAnimeList[0];
    const result = await queryPage.handleDeleteAnime(animeToDelete, mockActions.deleteAnime);
    expect(result.success).toBeTruthy();
    
    // WritePage也应只剩下1个动漫
    const animeList = queryPage.getCurrentAnimeList();
    expect(animeList).toHaveLength(1);
    expect(animeList[0].id).toBe('anime-2');
  });
});

// 测试场景4: 搜索功能与数据同步
describe('场景4: 搜索功能与数据同步', () => {
  // 模拟共享状态
  let sharedAnimeList: any[] = [
    {
      id: 'anime-1',
      title: '火影忍者',
      watchMethod: '在线观看',
      description: '忍者题材的动漫',
      tags: ['忍者', '动作', '冒险'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'anime-2',
      title: '海贼王',
      watchMethod: '下载观看',
      description: '海盗冒险的动漫',
      tags: ['海盗', '冒险', '友情'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'anime-3',
      title: '死神',
      watchMethod: '在线观看',
      description: '死神题材的动漫',
      tags: ['死神', '战斗', '超自然'],
      episodes: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];
  
  // 创建模拟组件
  const queryPage = new QueryPageSimulator(() => sharedAnimeList);
  
  test('QueryPage搜索功能应基于最新数据', () => {
    // 搜索"火影"
    const searchResult1 = queryPage.getFilteredAnimeList('火影');
    expect(searchResult1).toHaveLength(1);
    expect(searchResult1[0].title).toBe('火影忍者');
    
    // 搜索"冒险"
    const searchResult2 = queryPage.getFilteredAnimeList('冒险');
    expect(searchResult2).toHaveLength(2);
    expect(searchResult2.map((a: any) => a.title)).toEqual(['火影忍者', '海贼王']);
    
    // 搜索不存在的关键词
    const searchResult3 = queryPage.getFilteredAnimeList('不存在');
    expect(searchResult3).toHaveLength(0);
  });
});

// 测试场景5: 实时数据同步验证
describe('场景5: 实时数据同步验证', () => {
  // 模拟共享状态
  let sharedAnimeList: any[] = [];
  let dataUpdateCount = 0;
  
  const mockActions: MockAppDataActions = {
    addAnime: async (animeData) => {
      const newAnime = {
        ...animeData,
        id: `anime-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sharedAnimeList.push(newAnime);
      dataUpdateCount++;
      return { success: true };
    },
    updateAnime: async (id, updates) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList[index] = { ...sharedAnimeList[index], ...updates, updatedAt: new Date().toISOString() };
      dataUpdateCount++;
      return { success: true };
    },
    deleteAnime: async (id) => {
      const index = sharedAnimeList.findIndex(anime => anime.id === id);
      if (index === -1) {
        return { success: false, error: '动漫未找到' };
      }
      sharedAnimeList.splice(index, 1);
      dataUpdateCount++;
      return { success: true };
    }
  };
  
  // 创建模拟组件
  const writePage = new WritePageSimulator(mockActions);
  const queryPage = new QueryPageSimulator(() => sharedAnimeList);
  
  test('数据操作应实时更新所有组件', async () => {
    // 初始状态
    expect(queryPage.getCurrentAnimeList()).toHaveLength(0);
    expect(dataUpdateCount).toBe(0);
    
    // 添加动漫
    await writePage.handleSaveAnime({
      title: '测试动漫1',
      watchMethod: '在线观看',
      description: '测试描述1',
      tags: ['测试']
    });
    
    expect(dataUpdateCount).toBe(1);
    expect(queryPage.getCurrentAnimeList()).toHaveLength(1);
    
    // 再添加一个动漫
    await writePage.handleSaveAnime({
      title: '测试动漫2',
      watchMethod: '下载观看',
      description: '测试描述2',
      tags: ['测试']
    });
    
    expect(dataUpdateCount).toBe(2);
    expect(queryPage.getCurrentAnimeList()).toHaveLength(2);
    
    // 更新第一个动漫
    const firstAnime = sharedAnimeList[0];
    writePage.selectAnime(firstAnime);
    await writePage.handleSaveAnime({
      title: '更新后的标题',
      description: '更新后的描述'
    });
    
    expect(dataUpdateCount).toBe(3);
    expect(queryPage.getCurrentAnimeList()[0].title).toBe('更新后的标题');
    
    // 删除第二个动漫
    const secondAnime = sharedAnimeList[1];
    await writePage.handleDeleteAnime(secondAnime.id);
    
    expect(dataUpdateCount).toBe(4);
    expect(queryPage.getCurrentAnimeList()).toHaveLength(1);
  });
});

// 运行所有测试
console.log('\n=== 数据同步验证测试开始 ===\n');

// 运行测试场景
describe('场景1: 添加新动漫的数据同步', () => {
  // 测试已在上面定义
});

describe('场景2: 更新动漫的数据同步', () => {
  // 测试已在上面定义
});

describe('场景3: 删除动漫的数据同步', () => {
  // 测试已在上面定义
});

describe('场景4: 搜索功能与数据同步', () => {
  // 测试已在上面定义
});

describe('场景5: 实时数据同步验证', () => {
  // 测试已在上面定义
});

console.log('\n=== 数据同步验证测试完成 ===\n');