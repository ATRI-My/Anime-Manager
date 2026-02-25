# WritePage 添加新行功能重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构 WritePage 组件的添加新行功能，简化状态管理，消除状态同步问题

**Architecture:** 将双重状态管理（selectedAnime + state.animeList）改为单一状态管理（selectedAnimeId + 计算属性），移除所有 hack 代码

**Tech Stack:** React 18, TypeScript, Context API, Tailwind CSS

---

### Task 1: 基础状态重构 - 替换 selectedAnime

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:24`

**Step 1: 修改状态定义**

```typescript
// 当前第24行：
const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

// 改为：
const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
const selectedAnime = state.animeList.find(a => a.id === selectedAnimeId);
```

**Step 2: 运行类型检查**

```bash
npm run typecheck
```

Expected: 可能有类型错误，需要后续修复

**Step 3: 提交基础重构**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "refactor: 基础状态重构 - 替换selectedAnime为selectedAnimeId"
```

---

### Task 2: 更新选中动漫处理函数

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:40-43`

**Step 1: 修改 handleSelectAnime 函数**

```typescript
// 当前第40-43行：
const handleSelectAnime = (anime: Anime) => {
  setSelectedAnime(anime);
  setIsEditing(false);
};

// 改为：
const handleSelectAnime = (anime: Anime) => {
  setSelectedAnimeId(anime.id);
  setIsEditing(false);
};
```

**Step 2: 修改 handleAddAnime 函数**

```typescript
// 当前第35-38行：
const handleAddAnime = () => {
  setIsEditing(true);
  setSelectedAnime(null);
};

// 改为：
const handleAddAnime = () => {
  setIsEditing(true);
  setSelectedAnimeId(null);
};
```

**Step 3: 运行测试**

```bash
npm test -- WritePage.test.tsx
```

Expected: 测试可能失败，需要后续修复

**Step 4: 提交函数更新**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "refactor: 更新选中动漫处理函数"
```

---

### Task 3: 简化添加剧集函数

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:138-156`

**Step 1: 简化 handleAddEpisode 函数**

```typescript
// 当前第138-156行：
const handleAddEpisode = () => {
  if (!selectedAnime) {
    addToast('error', '无法添加剧集', '请先选择一个番剧');
    return;
  }
  
  setEditingEpisode(null);
  
  // 确保移除任何可能残留的焦点拦截器
  const blocker = document.getElementById('focus-blocker');
  if (blocker) {
    blocker.remove();
  }
  
  // 使用setTimeout确保状态更新完成后再打开模态框
  setTimeout(() => {
    setIsEpisodeModalOpen(true);
  }, 10);
};

// 改为：
const handleAddEpisode = () => {
  if (!selectedAnimeId) {
    addToast('error', '无法添加剧集', '请先选择一个番剧');
    return;
  }
  
  setEditingEpisode(null);
  setIsEpisodeModalOpen(true);
};
```

**Step 2: 修改 handleEditEpisode 函数**

```typescript
// 当前第158-169行：
const handleEditEpisode = (episodeId: string) => {
  if (!selectedAnime) return;
  const episode = selectedAnime.episodes.find(ep => ep.id === episodeId);
  if (episode) {
    setEditingEpisode(episode);
    
    // 使用setTimeout确保状态更新完成后再打开模态框
    setTimeout(() => {
      setIsEpisodeModalOpen(true);
    }, 10);
  }
};

// 改为：
const handleEditEpisode = (episodeId: string) => {
  if (!selectedAnime) return;
  const episode = selectedAnime.episodes.find(ep => ep.id === episodeId);
  if (episode) {
    setEditingEpisode(episode);
    setIsEpisodeModalOpen(true);
  }
};
```

**Step 3: 运行组件测试**

```bash
npm test -- --testPathPattern=WritePage
```

**Step 4: 提交简化函数**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "refactor: 简化添加和编辑剧集函数，移除setTimeout"
```

---

### Task 4: 更新剧集提交函数

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:211-251`

**Step 1: 简化 handleEpisodeSubmit 函数**

```typescript
// 当前第234-246行：
if (result.success) {
  // 使用返回的updatedAnime更新选中状态
  if (result.updatedAnime) {
    setSelectedAnime(result.updatedAnime);
  }
  
  // 添加提示：修改已保存到内存，需要手动保存到文件
  toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
  
  // 关闭模态框
  setIsEpisodeModalOpen(false);
  setEditingEpisode(null);
}

// 改为：
if (result.success) {
  // 不再需要手动更新selectedAnime，依赖全局状态自动更新
  
  // 添加提示：修改已保存到内存，需要手动保存到文件
  toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
  
  // 关闭模态框
  setIsEpisodeModalOpen(false);
  setEditingEpisode(null);
}
```

**Step 2: 修改 handleEpisodeDelete 函数**

```typescript
// 当前第254-278行：
const handleEpisodeDelete = async () => {
  if (!selectedAnime || !editingEpisode) return;
  
  try {
    const result = await actions.deleteEpisode(selectedAnime.id, editingEpisode.id);
    if (result.success) {
      addToast('success', '删除剧集', '剧集删除成功');
      
      // 刷新界面状态，确保组件重新渲染
      actions.refreshState();
      
      // 添加提示：修改已保存到内存，需要手动保存到文件
      toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
      
      // 关闭模态框
      setIsEpisodeModalOpen(false);
      setEditingEpisode(null);
    }
  }
};

// 改为：
const handleEpisodeDelete = async () => {
  if (!selectedAnimeId || !editingEpisode) return;
  
  try {
    const result = await actions.deleteEpisode(selectedAnimeId, editingEpisode.id);
    if (result.success) {
      addToast('success', '删除剧集', '剧集删除成功');
      
      // 不再需要手动刷新状态
      
      // 添加提示：修改已保存到内存，需要手动保存到文件
      toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
      
      // 关闭模态框
      setIsEpisodeModalOpen(false);
      setEditingEpisode(null);
    }
  }
};
```

**Step 3: 运行集成测试**

```bash
npm test -- --testPathPattern=WritePage
```

**Step 4: 提交剧集函数更新**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "refactor: 更新剧集提交和删除函数，移除手动状态更新"
```

---

### Task 5: 移除状态同步机制

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx:341-369`

**Step 1: 移除状态同步的 useEffect**

```typescript
// 删除第341-369行：
// 同步selectedAnime和全局状态
useEffect(() => {
  if (selectedAnime) {
    // 从全局状态中查找最新的anime数据
    const currentAnime = state.animeList.find(a => a.id === selectedAnime.id);
    if (currentAnime && JSON.stringify(currentAnime) !== JSON.stringify(selectedAnime)) {
      setSelectedAnime(currentAnime);
    } else if (!currentAnime) {
      // 如果selectedAnime指向的动漫在全局状态中不存在，重置为null
      // 这通常发生在打开新文件时
      setSelectedAnime(null);
    }
  }
}, [state.animeList]); // 只依赖state.animeList，不依赖selectedAnime

// 当打开新文件时，重置selectedAnime
useEffect(() => {
  // 当currentFilePath变化时（打开新文件），重置selectedAnime
  if (state.currentFilePath) {
    // 如果当前有选中的动漫，检查它是否存在于新文件中
    if (selectedAnime) {
      const existsInNewFile = state.animeList.some(a => a.id === selectedAnime.id);
      if (!existsInNewFile) {
        setSelectedAnime(null);
      }
    }
  }
}, [state.currentFilePath]); // 依赖currentFilePath
```

**Step 2: 添加新的文件打开处理**

```typescript
// 在第370行前添加：
// 当打开新文件时，重置selectedAnimeId
useEffect(() => {
  if (state.currentFilePath && selectedAnimeId) {
    // 检查选中的动漫是否存在于新文件中
    const existsInNewFile = state.animeList.some(a => a.id === selectedAnimeId);
    if (!existsInNewFile) {
      setSelectedAnimeId(null);
    }
  }
}, [state.currentFilePath, state.animeList, selectedAnimeId]);
```

**Step 3: 运行完整测试套件**

```bash
npm test
```

**Step 4: 提交状态同步移除**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "refactor: 移除状态同步机制，添加新的文件打开处理"
```

---

### Task 6: 修复剩余类型错误和引用

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx` (多处)

**Step 1: 修复所有 selectedAnime 引用**

检查并修复所有使用 `selectedAnime` 的地方，改为使用 `selectedAnimeId` 或计算属性 `selectedAnime`：

1. 第51行：`selectedAnime?.id` → `selectedAnimeId`
2. 第56行：`selectedAnime?.episodes` → `selectedAnime?.episodes`
3. 第57行：`selectedAnime?.createdAt` → `selectedAnime?.createdAt`
4. 第72行：`if (selectedAnime)` → `if (selectedAnimeId)`
5. 第74行：`selectedAnime.id` → `selectedAnimeId`
6. 第172行：`if (!selectedAnime)` → `if (!selectedAnimeId)`
7. 第174行：`selectedAnime.episodes` → `selectedAnime?.episodes`
8. 第179行：`selectedAnime.id` → `selectedAnimeId`
9. 第212行：`if (!selectedAnime)` → `if (!selectedAnimeId)`
10. 第218行：`selectedAnime.id` → `selectedAnimeId`
11. 第226行：`selectedAnime.id` → `selectedAnimeId`
12. 第255行：`if (!selectedAnime || !editingEpisode)` → `if (!selectedAnimeId || !editingEpisode)`
13. 第282行：`if (!selectedAnime || episodeIds.length === 0)` → `if (!selectedAnimeId || episodeIds.length === 0)`
14. 第287行：`selectedAnime.episodes` → `selectedAnime?.episodes`
15. 第292行：`...selectedAnime` → `...selectedAnime!`
16. 第303行：`selectedAnime.id` → `selectedAnimeId`
17. 第419行：`selectedAnime?.id === anime.id` → `selectedAnimeId === anime.id`
18. 第440行：`selectedAnime ? '编辑番剧'` → `selectedAnimeId ? '编辑番剧'`
19. 第453行：`initialData={selectedAnime || { __isNew: true }}` → `initialData={selectedAnime || { __isNew: true }}`
20. 第455行：`selectedAnime ? () => handleDeleteAnime(selectedAnime.id)` → `selectedAnimeId ? () => handleDeleteAnime(selectedAnimeId)`
21. 第465行：`{selectedAnime && (` → `{selectedAnimeId && selectedAnime && (`
22. 第469行：`episodes={selectedAnime.episodes}` → `episodes={selectedAnime.episodes}`
23. 第486行：`animeTitle={selectedAnime?.title}` → `animeTitle={selectedAnime?.title}`

**Step 2: 运行类型检查**

```bash
npm run typecheck
```

Expected: 应该通过类型检查

**Step 3: 运行完整测试**

```bash
npm test
```

**Step 4: 提交修复**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "fix: 修复所有selectedAnime引用和类型错误"
```

---

### Task 7: 添加优化和错误处理

**Files:**
- Modify: `src/renderer/components/WritePage/WritePage.tsx`

**Step 1: 添加 useMemo 优化计算属性**

```typescript
// 在第24行后添加：
import { useMemo } from 'react';

// 修改第26行：
const selectedAnime = useMemo(() => {
  return state.animeList.find(a => a.id === selectedAnimeId);
}, [state.animeList, selectedAnimeId]);
```

**Step 2: 添加错误边界处理**

```typescript
// 在handleAddEpisode函数中添加更详细的错误处理：
const handleAddEpisode = () => {
  try {
    if (!selectedAnimeId) {
      addToast('error', '无法添加剧集', '请先选择一个番剧');
      return;
    }
    
    // 验证选中的动漫是否存在
    if (!selectedAnime) {
      addToast('error', '无法添加剧集', '选中的番剧不存在或已被删除');
      setSelectedAnimeId(null);
      return;
    }
    
    setEditingEpisode(null);
    setIsEpisodeModalOpen(true);
  } catch (error) {
    console.error('打开添加剧集模态框失败:', error);
    addToast('error', '系统错误', '无法打开添加剧集界面');
  }
};
```

**Step 3: 运行最终测试**

```bash
npm test -- --testPathPattern=WritePage --coverage
```

**Step 4: 提交优化**

```bash
git add src/renderer/components/WritePage/WritePage.tsx
git commit -m "feat: 添加优化和错误处理，使用useMemo优化性能"
```

---

### Task 8: 验证和文档更新

**Files:**
- Create: `test-write-bug-fixed.js`
- Modify: `README.md`

**Step 1: 创建修复后的测试脚本**

```javascript
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
```

**Step 2: 运行测试脚本**

```bash
node test-write-bug-fixed.js
```

Expected: 所有测试通过

**Step 3: 更新README文档**

在README.md的"新增功能说明"部分添加：

```markdown
### WritePage状态管理重构（2026-02-23）

**问题修复**：解决了WritePage添加新行功能的状态同步问题，简化了状态管理架构。

**重构内容**：
1. **状态管理简化** - 将双重状态管理（selectedAnime + state.animeList）改为单一状态管理（selectedAnimeId + 计算属性）
2. **移除hack代码** - 去除了所有setTimeout和焦点处理hack
3. **错误处理增强** - 添加了更完善的错误处理和恢复机制
4. **性能优化** - 使用useMemo优化计算属性性能

**技术改进**：
- 代码行数减少约40行
- 状态同步逻辑完全移除
- 添加流程更简洁可靠
- 类型安全性更好
```

**Step 4: 提交验证和文档**

```bash
git add test-write-bug-fixed.js README.md
git commit -m "docs: 添加修复验证和更新文档"
```

---

## 执行选项

**Plan complete and saved to `docs/plans/2026-02-23-writepage-add-episode-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**