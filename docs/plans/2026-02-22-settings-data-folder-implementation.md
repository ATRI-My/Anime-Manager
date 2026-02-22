# 设置页面数据文件夹功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在设置页面的"应用设置"卡片中替换扫描路径部分，添加数据文件夹信息和一键打开功能

**Architecture:** 修改前端SettingsPage组件显示数据文件夹信息，添加主进程IPC处理器打开文件夹，保持现有UI样式

**Tech Stack:** Electron, React, TypeScript, Tailwind CSS

---

### Task 1: 添加主进程打开数据文件夹IPC处理器

**Files:**
- Modify: `src/main/file-system.ts:222` (文件末尾)

**Step 1: 添加IPC处理器代码**

在文件末尾的 `registerFileSystemHandlers` 函数内添加：

```typescript
  ipcMain.handle('open-data-folder', async () => {
    try {
      const userDataPath = app.getPath('userData')
      await shell.openPath(userDataPath)
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('打开数据文件夹失败:', error)
      return { success: false, error: errorMessage }
    }
  })
```

**Step 2: 验证文件语法**

Run: `npx tsc -p tsconfig.main.json --noEmit`
Expected: 无类型错误

**Step 3: 提交更改**

```bash
git add src/main/file-system.ts
git commit -m "feat: add open-data-folder IPC handler"
```

---

### Task 2: 更新渲染进程类型定义

**Files:**
- Modify: `src/renderer/global.d.ts`

**Step 1: 添加openDataFolder类型定义**

在 `ElectronAPI` 接口中添加：

```typescript
  openDataFolder?: () => Promise<{ success: boolean; error?: string }>
```

完整接口应包含：

```typescript
interface ElectronAPI {
  readFile?: (filePath: string) => Promise<any>
  writeFile?: (filePath: string, content: any) => Promise<{ success: boolean }>
  getSettings?: () => Promise<Settings>
  saveSettings?: (settings: Settings) => Promise<{ success: boolean }>
  openWithTool?: (url: string, toolConfig: ToolConfig) => Promise<{ success: boolean; error?: string }>
  readAnimeData?: () => Promise<AppData>
  writeAnimeData?: (content: AppData) => Promise<{ success: boolean }>
  openFileDialog?: () => Promise<{ canceled: boolean; filePaths: string[] }>
  saveFileDialog?: () => Promise<{ canceled: boolean; filePath: string }>
  openDataFolder?: () => Promise<{ success: boolean; error?: string }>
}
```

**Step 2: 验证类型定义**

Run: `npx tsc --noEmit`
Expected: 无类型错误

**Step 3: 提交更改**

```bash
git add src/renderer/global.d.ts
git commit -m "feat: add openDataFolder type definition"
```

---

### Task 3: 修改SettingsPage组件UI

**Files:**
- Modify: `src/renderer/components/SettingsPage/SettingsPage.tsx:93-104`

**Step 1: 替换扫描路径部分**

将第93-104行从：

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    扫描路径
  </label>
  <input
    type="text"
    value="C:/Anime"
    readOnly
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
  />
  <p className="mt-1 text-sm text-gray-500">此功能暂未实现</p>
</div>
```

替换为：

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    数据文件位置
  </label>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      value="%APPDATA%\\anime-manager\\"
      readOnly
      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
    />
    <button
      onClick={handleOpenDataFolder}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      打开文件夹
    </button>
  </div>
  <p className="mt-1 text-sm text-gray-500">应用数据存储在此目录</p>
</div>
```

**Step 2: 添加handleOpenDataFolder函数**

在第48行后添加：

```tsx
  const handleOpenDataFolder = async () => {
    try {
      const result = await (window as any).electronAPI?.openDataFolder?.();
      if (!result?.success) {
        addToast('error', '打开文件夹失败', result?.error || '未知错误');
      }
    } catch (error) {
      addToast('error', '打开文件夹失败', error instanceof Error ? error.message : '未知错误');
    }
  };
```

**Step 3: 验证组件编译**

Run: `npm run build`
Expected: 构建成功

**Step 4: 提交更改**

```bash
git add src/renderer/components/SettingsPage/SettingsPage.tsx
git commit -m "feat: update settings page with data folder info and open button"
```

---

### Task 4: 测试功能

**Step 1: 启动开发服务器**

Run: `npm run dev`
Expected: 应用正常启动

**Step 2: 手动测试功能**

1. 导航到设置页面
2. 验证"数据文件位置"显示正确
3. 点击"打开文件夹"按钮
4. 验证文件资源管理器打开正确目录

**Step 3: 验证现有功能**

检查其他设置功能（工具配置、测试功能等）是否正常工作

**Step 4: 最终提交**

```bash
git add docs/plans/2026-02-22-settings-data-folder-design.md
git commit -m "docs: add data folder feature design document"
```

---

### Task 5: 构建验证

**Step 1: 运行完整构建**

Run: `npm run verify-build`
Expected: 构建验证通过

**Step 2: 检查最终状态**

Run: `git status`
Expected: 无未提交更改

**完成标准：**
1. 设置页面显示数据文件夹信息
2. 点击"打开文件夹"按钮正确打开目录
3. 所有现有功能正常工作
4. 构建验证通过