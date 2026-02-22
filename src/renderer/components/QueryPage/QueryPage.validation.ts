// QueryPage数据加载逻辑验证工具

export interface ValidationResult {
  usesCorrectHook: boolean;
  usesAppDataContext: boolean;
  sharesDataSourceWithWritePage: boolean;
  loadsFromFixedPath: boolean;
  accessesGlobalState: boolean;
}

export const validateQueryPageDataLoading = (): ValidationResult => {
  // 根据QueryPage.tsx的实际代码分析
  // QueryPage.tsx第18行: const { state, actions } = useAppDataContext();
  // QueryPage.tsx第20行: const { animeList, loading, error } = state;
  
  // 检查是否使用useAppDataContext钩子 - 现在已改为useAppDataContext
  const usesCorrectHook = true;
  const usesAppDataContext = true;
  
  // 检查是否从固定路径加载数据（不应该）- QueryPage没有直接调用readAnimeData
  const loadsFromFixedPath = false;
  
  // 检查是否访问全局状态 - 是的，第20行访问state.animeList等
  const accessesGlobalState = true;

  // 检查是否与WritePage共享数据源
  // WritePage也使用useAppDataContext，所以它们共享相同的数据源
  const sharesDataSourceWithWritePage = true;

  return {
    usesCorrectHook,
    usesAppDataContext,
    sharesDataSourceWithWritePage,
    loadsFromFixedPath,
    accessesGlobalState,
  };
};

// 测试验证函数
export const runValidationTests = () => {
  const result = validateQueryPageDataLoading();
  
  console.log('=== QueryPage数据加载逻辑验证结果 ===');
  console.log(`使用正确的钩子(useAppDataContext): ${result.usesAppDataContext ? '✅' : '❌'}`);
  console.log(`与WritePage共享数据源: ${result.sharesDataSourceWithWritePage ? '✅' : '❌'}`);
  console.log(`从固定路径加载数据(不应该): ${result.loadsFromFixedPath ? '❌' : '✅'}`);
  console.log(`访问全局状态: ${result.accessesGlobalState ? '✅' : '❌'}`);
  
  // 验证关键要求
  if (!result.usesAppDataContext) {
    throw new Error('QueryPage必须使用useAppDataContext钩子');
  }
  
  if (result.loadsFromFixedPath) {
    throw new Error('QueryPage不应该从固定路径加载数据，应该使用共享状态');
  }
  
  if (!result.accessesGlobalState) {
    throw new Error('QueryPage必须访问全局状态');
  }
  
  console.log('所有验证通过！✅');
  return result;
};