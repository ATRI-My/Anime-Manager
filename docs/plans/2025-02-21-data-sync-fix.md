# 数据同步问题修复实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复写入页面和查询页面之间的数据同步问题，确保两个页面共享相同的数据源

**Architecture:** 修改查询页面的数据加载逻辑，让它从写入页面使用的相同数据源（内存状态）读取数据，而不是从固定文件路径加载

**Tech Stack:** React, TypeScript, Electron, React Hooks

---

### Task 1: 分析当前数据流问题

**Files:**
- Analyze: `src/renderer/hooks/useAppData.ts`
- Analyze: `src/renderer/components/QueryPage/QueryPage.tsx`
- Analyze: `src/renderer/components/WritePage/WritePage.tsx`

**Step 1: 理解当前数据流**
- 写入页面：使用 `useAppData` 钩子管理内存状态
- 查询页面：使用 `useAppData` 钩子，但初始化时从固定文件路径加载
- 问题：两个页面使用不同的数据源

**Step 2: 确认修复方案**
- 方案：让查询页面直接使用 `useAppData` 的内存状态，而不是重新加载文件
- 需要：修改查询页面的数据初始化逻辑

### Task 2: 修改查询页面数据加载逻辑

**Files:**
- Modify: `src/renderer/components/QueryPage/QueryPage.tsx:17-21`

**Step 1: 查看当前查询页面数据加载**
```typescript
const { state, actions } = useAppDataWithToast();
const { animeList, loading, error } = state;
```

**Step 2: 确认问题**
- 查询页面使用 `useAppDataWithToast`，但该钩子内部会从固定路径加载数据
- 需要确保查询页面使用与写入页面相同的状态

**Step 3: 修改查询页面**
```typescript
// 当前：从 useAppDataWithToast 获取数据
// 修改：直接使用传入的 animeList，或者确保 useAppData 状态共享
```

### Task 3: 确保 useAppData 状态共享

**Files:**
- Modify: `src/renderer/hooks/useAppData.ts:505-540`

**Step 1: 分析初始化逻辑**
```typescript
// 当前：每个 useAppData 实例都会重新加载数据
useEffect(() => {
  const loadInitialData = async () => {
    try {
      const data = await window.electronAPI?.readAnimeData?.();
      // ... 设置状态
    } catch (error) {
      // ... 错误处理
    }
  };
  loadInitialData();
}, []);
```

**Step 2: 问题识别**
- 每个组件实例都会调用 `readAnimeData`，导致重复加载
- 应该使用共享状态或上下文

**Step 3: 创建数据上下文**

**Files:**
- Create: `src/renderer/contexts/AppDataContext.tsx`

**Step 4: 实现数据上下文**
```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { useAppData } from '../hooks/useAppData';

interface AppDataContextType {
  state: ReturnType<typeof useAppData>['state'];
  actions: ReturnType<typeof useAppData>['actions'];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, actions } = useAppData();
  
  return (
    <AppDataContext.Provider value={{ state, actions }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within AppDataProvider');
  }
  return context;
};
```

### Task 4: 修改 App.tsx 使用数据上下文

**Files:**
- Modify: `src/renderer/App.tsx:73-80`

**Step 1: 包装应用组件**
```typescript
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppDataProvider>
        <ToastContainer />
        <AppContent />
      </AppDataProvider>
    </ToastProvider>
  );
};
```

### Task 5: 修改查询页面使用数据上下文

**Files:**
- Modify: `src/renderer/components/QueryPage/QueryPage.tsx:17-21`

**Step 2: 替换数据获取方式**
```typescript
// 替换前：
const { state, actions } = useAppDataWithToast();

// 替换后：
const { state, actions } = useAppDataContext();
```

### Task 6: 修改写入页面使用数据上下文

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:22`

**Step 1: 替换数据获取方式**
```typescript
// 替换前：
const { state, actions } = useAppDataWithToast();

// 替换后：
const { state, actions } = useAppDataContext();
```

### Task 7: 移除 useAppDataWithToast 钩子

**Files:**
- Delete: `src/renderer/hooks/useAppDataWithToast.ts`

**Step 1: 检查依赖**
- 确保没有其他组件使用 `useAppDataWithToast`
- 更新所有导入

### Task 8: 测试数据同步

**Step 1: 创建测试场景**
1. 在写入页面添加新动漫
2. 切换到查询页面
3. 验证新动漫是否显示

**Step 2: 运行应用测试**
```bash
npm run dev
```

### Task 9: 添加文件保存后的数据刷新

**Files:**
- Modify: `src/renderer/hooks/useAppData.ts:166-174`

**Step 1: 修改保存文件逻辑**
```typescript
const saveFile = useCallback(async () => {
  console.log('saveFile');
  if (!state.currentFilePath) {
    console.log('没有文件路径，调用 saveAsFile');
    return await saveAsFile();
  }
  
  const result = await saveToFile(state.currentFilePath);
  
  // 保存成功后，更新内存中的数据源路径
  if (result.success) {
    // 这里可以触发数据刷新，确保查询页面使用最新数据
    await reloadData();
  }
  
  return result;
}, [state.currentFilePath, saveAsFile, saveToFile, reloadData]);
```

### Task 10: 验证修复

**Step 1: 测试场景**
1. 在写入页面修改数据
2. 保存文件
3. 切换到查询页面
4. 验证数据是否同步

**Step 2: 运行完整测试**
```bash
# 如果有测试，运行测试
# 如果没有，手动测试所有功能
```