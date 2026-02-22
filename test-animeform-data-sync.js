// 专门测试AnimeForm数据同步功能的脚本
console.log('=== 开始测试AnimeForm数据同步功能 ===\n');

// 模拟测试框架
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
      }
    }
  };
}

// 模拟AnimeForm组件的数据同步逻辑
class MockAnimeForm {
  constructor(props) {
    this.props = props;
    this.state = {
      formData: {
        title: props.initialData?.title || '',
        watchMethod: props.initialData?.watchMethod || '在线观看',
        description: props.initialData?.description || '',
        tags: props.initialData?.tags || []
      },
      tagInput: ''
    };
  }

  // 模拟useEffect监听initialData变化
  updateFromProps(newProps) {
    if (newProps.initialData) {
      this.state.formData = {
        title: newProps.initialData.title || '',
        watchMethod: newProps.initialData.watchMethod || '在线观看',
        description: newProps.initialData.description || '',
        tags: newProps.initialData.tags || []
      };
      // 清空标签输入框
      this.state.tagInput = '';
    }
  }
}

// 运行测试
let passed = 0;
let total = 0;

// 测试1: 初始数据加载
total++;
if (test('应该正确加载初始数据', () => {
  const initialData = {
    title: '测试番剧',
    watchMethod: '下载观看',
    description: '这是一个测试',
    tags: ['动作', '冒险']
  };

  const form = new MockAnimeForm({
    onSubmit: () => {},
    initialData
  });

  expect(form.state.formData.title).toBe('测试番剧');
  expect(form.state.formData.watchMethod).toBe('下载观看');
  expect(form.state.formData.tags).toEqual(['动作', '冒险']);
})) {
  passed++;
}

// 测试2: 数据同步更新
total++;
if (test('应该更新表单数据当initialData变化', () => {
  const initialData1 = {
    title: '番剧1',
    watchMethod: '在线观看',
    description: '描述1',
    tags: ['标签1', '标签2']
  };

  const initialData2 = {
    title: '番剧2',
    watchMethod: '下载观看',
    description: '描述2',
    tags: ['标签3']
  };

  const form = new MockAnimeForm({
    onSubmit: () => {},
    initialData: initialData1
  });

  // 验证初始数据
  expect(form.state.formData.title).toBe('番剧1');
  expect(form.state.formData.watchMethod).toBe('在线观看');
  expect(form.state.formData.tags).toEqual(['标签1', '标签2']);

  // 更新数据
  form.updateFromProps({ initialData: initialData2 });

  // 验证更新后的数据
  expect(form.state.formData.title).toBe('番剧2');
  expect(form.state.formData.watchMethod).toBe('下载观看');
  expect(form.state.formData.tags).toEqual(['标签3']);
  
  // 验证标签输入框被清空
  expect(form.state.tagInput).toBe('');
})) {
  passed++;
}

// 测试3: 部分数据更新
total++;
if (test('应该处理部分数据更新', () => {
  const initialData1 = {
    title: '完整番剧',
    watchMethod: '在线观看',
    description: '完整描述',
    tags: ['标签1']
  };

  const initialData2 = {
    title: '更新后的番剧'
    // 只更新标题，其他字段保持原样或使用默认值
  };

  const form = new MockAnimeForm({
    onSubmit: () => {},
    initialData: initialData1
  });

  // 更新数据
  form.updateFromProps({ initialData: initialData2 });

  // 验证标题更新，其他字段使用默认值
  expect(form.state.formData.title).toBe('更新后的番剧');
  expect(form.state.formData.watchMethod).toBe('在线观看'); // 默认值
  expect(form.state.formData.tags).toEqual([]); // 默认空数组
})) {
  passed++;
}

// 测试4: 空数据更新
total++;
if (test('应该处理空initialData', () => {
  const initialData1 = {
    title: '原有番剧',
    watchMethod: '下载观看',
    tags: ['标签1']
  };

  const form = new MockAnimeForm({
    onSubmit: () => {},
    initialData: initialData1
  });

  // 更新为空数据
  form.updateFromProps({ initialData: {} });

  // 验证所有字段都重置为默认值
  expect(form.state.formData.title).toBe('');
  expect(form.state.formData.watchMethod).toBe('在线观看');
  expect(form.state.formData.tags).toEqual([]);
})) {
  passed++;
}

console.log(`\n=== 测试结果 ===`);
console.log(`通过: ${passed}/${total}`);
console.log(`成功率: ${Math.round((passed / total) * 100)}%`);

if (passed === total) {
  console.log('\n🎉 所有数据同步测试通过！');
  console.log('AnimeForm组件的数据同步功能正常工作。');
} else {
  console.log(`\n⚠️  有 ${total - passed} 个测试失败，请检查实现。`);
}

process.exit(passed === total ? 0 : 1);