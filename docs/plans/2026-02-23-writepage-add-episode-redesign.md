# WritePage 添加新行功能重构设计

## 概述
重构 WritePage 组件的添加新行（添加剧集）功能，解决状态管理复杂性和 bug 问题。

## 当前问题分析
1. **双重状态管理**：`selectedAnime`（本地状态）与 `state.animeList`（全局状态）需要手动同步
2. **状态不一致**：添加/删除剧集后可能出现状态不同步
3. **使用 hack**：使用 setTimeout 处理焦点和模态框打开问题
4. **错误处理不完善**：添加失败时状态恢复机制不足

## 设计目标
1. 简化状态管理，消除状态同步问题
2. 移除所有 hack 和 workaround
3. 提高代码可维护性和可靠性
4. 改善用户体验

## 技术方案

### 1. 状态管理重构
**当前结构**：
```typescript
const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
```

**新结构**：
```typescript
const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
const selectedAnime = state.animeList.find(a => a.id === selectedAnimeId);
```

### 2. 添加新行流程优化
**当前流程**：
1. 检查 selectedAnime 是否存在
2. 使用 setTimeout 打开模态框
3. 用户提交后更新 selectedAnime
4. 手动同步到全局状态

**新流程**：
1. 检查 selectedAnimeId 是否存在
2. 直接打开模态框
3. 用户提交后调用 actions.addEpisode
4. 依赖全局状态自动更新界面

### 3. 关键函数重构

#### handleAddEpisode
**当前实现**：
```typescript
const handleAddEpisode = () => {
  if (!selectedAnime) {
    addToast('error', '无法添加剧集', '请先选择一个番剧');
    return;
  }
  
  setEditingEpisode(null);
  
  // 移除焦点拦截器
  const blocker = document.getElementById('focus-blocker');
  if (blocker) {
    blocker.remove();
  }
  
  // 使用setTimeout确保状态更新完成
  setTimeout(() => {
    setIsEpisodeModalOpen(true);
  }, 10);
};
```

**新实现**：
```typescript
const handleAddEpisode = () => {
  if (!selectedAnimeId) {
    addToast('error', '无法添加剧集', '请先选择一个番剧');
    return;
  }
  
  setEditingEpisode(null);
  setIsEpisodeModalOpen(true);
};
```

#### handleEpisodeSubmit
**当前实现**：
```typescript
if (result.success) {
  // 使用返回的updatedAnime更新选中状态
  if (result.updatedAnime) {
    setSelectedAnime(result.updatedAnime);
  }
  
  // 添加提示
  toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
  
  // 关闭模态框
  setIsEpisodeModalOpen(false);
  setEditingEpisode(null);
}
```

**新实现**：
```typescript
if (result.success) {
  // 不再需要手动更新selectedAnime
  // 依赖全局状态自动更新
  
  // 添加提示
  toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
  
  // 关闭模态框
  setIsEpisodeModalOpen(false);
  setEditingEpisode(null);
}
```

### 4. 状态同步机制移除
**当前代码**：
```typescript
useEffect(() => {
  if (selectedAnime) {
    const currentAnime = state.animeList.find(a => a.id === selectedAnime.id);
    if (currentAnime && JSON.stringify(currentAnime) !== JSON.stringify(selectedAnime)) {
      setSelectedAnime(currentAnime);
    } else if (!currentAnime) {
      setSelectedAnime(null);
    }
  }
}, [state.animeList]);
```

**新设计**：移除整个 useEffect，不再需要手动同步

### 5. 界面更新机制
**当前**：依赖 selectedAnime 状态变化触发重新渲染
**新设计**：依赖全局状态变化自动重新渲染，selectedAnime 是计算属性

## 实施步骤

### 阶段1：基础重构
1. 将 selectedAnime 状态改为 selectedAnimeId
2. 更新所有使用 selectedAnime 的地方
3. 移除状态同步的 useEffect

### 阶段2：功能优化
1. 简化 handleAddEpisode 函数
2. 移除 setTimeout 和焦点处理代码
3. 更新 handleEpisodeSubmit 函数

### 阶段3：测试验证
1. 测试添加剧集功能
2. 测试删除剧集功能
3. 测试状态一致性
4. 测试错误处理

## 预期效果

### 代码改进
1. 代码行数减少约 30-40 行
2. 移除所有 hack 和 workaround
3. 状态管理更清晰

### 功能改进
1. 添加新行功能更可靠
2. 状态一致性得到保证
3. 错误处理更健壮

### 用户体验
1. 添加流程更流畅
2. 响应更及时
3. 错误提示更清晰

## 风险与缓解

### 风险1：现有功能破坏
- **缓解**：逐步重构，每个阶段充分测试
- **缓解**：保持现有接口不变

### 风险2：性能问题
- **缓解**：计算属性 selectedAnime 性能影响小
- **缓解**：使用 useMemo 优化计算

### 风险3：其他组件依赖
- **缓解**：检查所有使用 WritePage 的组件
- **缓解**：更新相关组件接口

## 验收标准
1. 添加剧集功能正常工作
2. 删除剧集功能正常工作
3. 状态始终保持一致
4. 无 setTimeout 等 hack 代码
5. 错误处理完善

## 后续优化建议
1. 考虑使用 React Query 进一步优化数据管理
2. 添加乐观更新模式
3. 实现离线支持
4. 添加撤销/重做功能

---
**设计批准**：✅ 已批准
**设计日期**：2026-02-23
**设计者**：AI Assistant
**实施状态**：待实施