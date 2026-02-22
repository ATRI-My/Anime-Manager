# 动漫数据文件系统实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在file-system.ts中添加动漫数据常量、专门的API处理器，修复useAnimeData.ts中的路径问题

**Architecture:** 添加ANIME_DATA_FILE_NAME常量，创建专门的动漫数据IPC处理器，使用shared/types.ts中的AppData接口和shared/constants.ts中的DEFAULT_APP_DATA

**Tech Stack:** TypeScript, Electron, Node.js fs模块

---

### Task 1: 添加动漫数据常量到file-system.ts

**Files:**
- Modify: `src/main/file-system.ts:11-124`

**Step 1: 添加导入和常量**

```typescript
// 在现有导入后添加
import { AppData } from '../shared/types'
import { DEFAULT_APP_DATA, APP_VERSION } from '../shared/constants'

// 在SETTINGS_FILE_NAME常量后添加
const ANIME_DATA_FILE_NAME = 'anime-data.json'
```

**Step 2: 添加文件路径函数**

```typescript
function getAnimeDataPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, ANIME_DATA_FILE_NAME)
}
```

**Step 3: 添加文件存在性检查函数**

```typescript
async function ensureAnimeDataFileExists(): Promise<void> {
  const animeDataPath = getAnimeDataPath()
  try {
    await accessAsync(animeDataPath, fs.constants.F_OK)
  } catch {
    await mkdirAsync(path.dirname(animeDataPath), { recursive: true })
    await writeFileAsync(animeDataPath, JSON.stringify(DEFAULT_APP_DATA, null, 2))
  }
}
```

**Step 4: 运行TypeScript检查**

```bash
npx tsc --noEmit
```
Expected: 无类型错误

**Step 5: 提交**

```bash
git add src/main/file-system.ts
git commit -m "feat: add anime data constants and file path functions"
```

---

### Task 2: 添加动漫数据API处理器

**Files:**
- Modify: `src/main/file-system.ts:52-124` (registerFileSystemHandlers函数)

**Step 1: 添加get-anime-data处理器**

```typescript
ipcMain.handle('get-anime-data', async () => {
  try {
    await ensureAnimeDataFileExists()
    const animeDataPath = getAnimeDataPath()
    const data = await readFileAsync(animeDataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('获取动漫数据失败，返回默认数据:', error)
    return DEFAULT_APP_DATA
  }
})
```

**Step 2: 添加save-anime-data处理器**

```typescript
ipcMain.handle('save-anime-data', async (_event, appData: AppData) => {
  try {
    const animeDataPath = getAnimeDataPath()
    await mkdirAsync(path.dirname(animeDataPath), { recursive: true })
    await writeFileAsync(animeDataPath, JSON.stringify(appData, null, 2))
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`保存动漫数据失败: ${errorMessage}`)
  }
})
```

**Step 3: 运行TypeScript检查**

```bash
npx tsc --noEmit
```
Expected: 无类型错误

**Step 4: 提交**

```bash
git add src/main/file-system.ts
git commit -m "feat: add anime data API handlers"
```

---

### Task 3: 更新preload.ts暴露新API

**Files:**
- Modify: `src/main/preload.ts:16-40`

**Step 1: 添加动漫数据API到contextBridge**

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作API
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: any) => ipcRenderer.invoke('write-file', filePath, content),
  
  // 设置API
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Settings) => ipcRenderer.invoke('save-settings', settings),
  
  // 动漫数据API
  getAnimeData: () => ipcRenderer.invoke('get-anime-data'),
  saveAnimeData: (appData: AppData) => ipcRenderer.invoke('save-anime-data', appData),
  
  // 工具打开API
  openWithTool: (url: string, toolConfig: ToolConfig) => ipcRenderer.invoke('open-with-tool', url, toolConfig)
})
```

**Step 2: 更新TypeScript类型声明**

```typescript
declare global {
  interface Window {
    electronAPI: {
      readFile: (filePath: string) => Promise<any>
      writeFile: (filePath: string, content: any) => Promise<{ success: boolean }>
      getSettings: () => Promise<Settings>
      saveSettings: (settings: Settings) => Promise<{ success: boolean }>
      getAnimeData: () => Promise<AppData>
      saveAnimeData: (appData: AppData) => Promise<{ success: boolean }>
      openWithTool: (url: string, toolConfig: ToolConfig) => Promise<{ success: boolean; error?: string }>
    }
  }
}
```

**Step 3: 添加AppData导入**

```typescript
import { AppData } from '../shared/types'
```

**Step 4: 运行TypeScript检查**

```bash
npx tsc --noEmit
```
Expected: 无类型错误

**Step 5: 提交**

```bash
git add src/main/preload.ts
git commit -m "feat: expose anime data APIs in preload"
```

---

### Task 4: 更新useAnimeData.ts使用新API

**Files:**
- Modify: `src/renderer/hooks/useAnimeData.ts:1-101`

**Step 1: 移除ANIME_DATA_FILE常量**

```typescript
// 删除第5行: const ANIME_DATA_FILE = 'anime-data.json';
```

**Step 2: 更新loadAnimeData函数**

```typescript
const loadAnimeData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await (window as any).electronAPI.getAnimeData();
    setAnimeList(data.animeList || []);
  } catch (err) {
    console.error('加载动漫数据失败:', err);
    setError('加载数据失败');
    setAnimeList([]);
  } finally {
    setLoading(false);
  }
}, []);
```

**Step 3: 更新saveAnimeData函数**

```typescript
const saveAnimeData = useCallback(async (data: AppData) => {
  try {
    await (window as any).electronAPI.saveAnimeData(data);
    return { success: true };
  } catch (err) {
    console.error('保存动漫数据失败:', err);
    return { success: false, error: '保存失败' };
  }
}, []);
```

**Step 4: 运行TypeScript检查**

```bash
npx tsc --noEmit
```
Expected: 无类型错误

**Step 5: 提交**

```bash
git add src/renderer/hooks/useAnimeData.ts
git commit -m "refactor: use anime data APIs instead of file paths"
```

---

### Task 5: 测试API功能

**Files:**
- Create: `test-anime-data-api.js`

**Step 1: 创建测试脚本**

```javascript
// 测试动漫数据API
const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// 模拟测试
console.log('测试动漫数据API...');

// 检查文件路径函数
const userDataPath = app.getPath('userData');
const animeDataPath = path.join(userDataPath, 'anime-data.json');
console.log('动漫数据文件路径:', animeDataPath);

// 检查默认数据
const defaultData = {
  version: '1.0.0',
  animeList: []
};
console.log('默认数据结构:', JSON.stringify(defaultData, null, 2));

console.log('测试完成！');
```

**Step 2: 运行测试**

```bash
node test-anime-data-api.js
```
Expected: 输出文件路径和默认数据结构

**Step 3: 清理测试文件**

```bash
rm test-anime-data-api.js
```

**Step 4: 提交最终版本**

```bash
git add -A
git commit -m "test: verify anime data API functionality"
```

---

### Task 6: 运行完整构建测试

**Step 1: 运行TypeScript检查**

```bash
npx tsc --noEmit
```
Expected: 无类型错误

**Step 2: 运行构建**

```bash
npm run build
```
Expected: 构建成功

**Step 3: 最终提交**

```bash
git add -A
git commit -m "chore: complete anime data file system implementation"
```

---

**计划完成！**

**执行选项：**

1. **Subagent-Driven (当前会话)** - 我分派新的子代理执行每个任务，任务间进行代码审查，快速迭代

2. **Parallel Session (单独会话)** - 在新的工作树中打开新会话，使用executing-plans技能进行批量执行

**选择哪种方法？**