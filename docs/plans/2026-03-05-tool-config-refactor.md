# 自定义工具配置重构计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan step-by-step.

**Goal:** 将单一的自定义工具配置重构为按链接类型（网址、磁力、本地文件）分类的三个独立配置

**Architecture:** 分离数据存储、智能类型判断、前端分类展示

**Tech Stack:** TypeScript, React, Electron

---

## 背景

当前问题：
- 所有链接类型（网址、磁力、本地文件）共用一个自定义工具配置
- 命令行参数对网址/磁力链接不适用
- 用户体验差，配置繁琐且不直观

---

## Step 1: 修改数据类型定义

**Files:**
- Modify: `src/shared/types.ts`

**Step 1: 更新 ToolConfig 接口**

修改 `ToolConfig` 类型定义：

```typescript
// 旧结构
interface ToolConfig {
  useCustomTool: boolean
  customTool: {
    name: string
    path: string
    arguments: string
  }
  lastTestResult?: {...}
}

// 新结构
type LinkType = 'url' | 'magnet' | 'localFile'

interface SingleToolConfig {
  enabled: boolean
  name: string
  path: string
  arguments: string
}

interface ToolConfig {
  url: SingleToolConfig      // 网址 (https://...)
  magnet: SingleToolConfig   // 磁力链接 (magnet:...)
  localFile: SingleToolConfig // 本地文件
  lastTestResults?: {
    url?: { success: boolean; message: string; timestamp: string }
    magnet?: { success: boolean; message: string; timestamp: string }
    localFile?: { success: boolean; message: string; timestamp: string }
  }
}
```

**Step 2: 更新 Settings 接口**

```typescript
interface Settings {
  toolConfig: ToolConfig
  virtualScrollConfig?: VirtualScrollConfig
}
```

**Step 3: 设置默认值**

在 `defaultSettings` 中设置：
- `url.enabled = false`
- `magnet.enabled = false`
- `localFile.enabled = false`
- 默认 arguments 保持 `{url}` 占位符

---

## Step 2: 修改后端逻辑

**Files:**
- Modify: `src/main/file-system.ts`

**Step 1: 修改 defaultSettings**

更新 `defaultSettings` 对象以匹配新结构。

**Step 2: 添加链接类型判断函数**

```typescript
function detectLinkType(link: string): 'url' | 'magnet' | 'localFile' {
  if (link.startsWith('magnet:')) return 'magnet'
  if (/^https?:\/\//.test(link)) return 'url'
  return 'localFile'  // file://, C:\, /, \\ 等
}
```

**Step 3: 修改 open-with-tool 处理逻辑**

```typescript
ipcMain.handle('open-with-tool', async (_event, url: string, toolConfig: ToolConfig) => {
  const linkType = detectLinkType(url)
  const typeConfig = toolConfig[linkType]
  
  if (typeConfig.enabled && typeConfig.path) {
    // 使用自定义工具执行
    const { exec } = await import('child_process')
    const execAsync = promisify(exec)
    
    let command = `"${typeConfig.path}"`
    if (typeConfig.arguments) {
      command += ' ' + typeConfig.arguments.replace(/{url}/g, `"${url}"`)
    } else {
      command += ` "${url}"`
    }
    
    await execAsync(command)
    return { success: true }
  } else {
    // 使用默认处理方式
    if (linkType === 'localFile') {
      await shell.openPath(url)
    } else {
      await shell.openExternal(url)
    }
    return { success: true }
  }
})
```

---

## Step 3: 修改前端 - 类型定义导出

**Files:**
- Modify: `src/main/preload.ts`

确保 preload.ts 中的类型导出与 shared/types.ts 保持一致。

---

## Step 4: 重构 ToolConfigForm 组件

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 创建工具类型选项卡/区块**

将三个链接类型的配置分为三个独立的区块或使用选项卡切换：

```
┌─────────────────────────────────────┐
│ [网址] [磁力] [本地文件]              │
├─────────────────────────────────────┤
│ 当前类型配置：                       │
│ ☑ 启用自定义工具                     │
│ 工具名称: [PotPlayer]               │
│ 工具路径: [C:\Program Files\...]   │
│ 命令行参数: [{url}]                 │
│                                     │
│ [测试此类型] [保存]                  │
└─────────────────────────────────────┘
```

**Step 2: 状态管理调整**

- 使用 `activeType: 'url' | 'magnet' | 'localFile'` 追踪当前编辑的类型
- 分别为每种类型维护独立的 `lastTestResult`

**Step 3: 测试函数调整**

- `handleTestTool` 接收 `linkType` 参数
- 测试 URL 使用固定的测试 URL（保持 google.com）

---

## Step 5: 更新 SettingsPage

**Files:**
- Modify: `src/renderer/components/SettingsPage/SettingsPage.tsx`

**Step 1: 调整 handleTestTool 函数**

```typescript
const handleTestTool = async (toolConfig: ToolConfig, linkType: 'url' | 'magnet' | 'localFile') => {
  // 根据 linkType 使用不同的测试 URL
  const testUrls = {
    url: 'https://www.google.com',
    magnet: 'magnet:?xt=urn:btih:test',
    localFile: 'E:\\test\\video.mp4'
  }
  
  const result = await window.electronAPI.openWithTool(testUrls[linkType], toolConfig)
  // ...
}
```

---

## 迁移兼容性

**问题:** 旧版本用户的 `settings.json` 只有旧结构

**解决方案:** 
在读取 settings 时进行迁移：

```typescript
function migrateToolConfig(oldConfig: OldToolConfig): ToolConfig {
  if ('useCustomTool' in oldConfig) {
    // 旧版本迁移：将原配置应用到本地文件类型
    return {
      url: { enabled: false, name: '', path: '', arguments: '{url}' },
      magnet: { enabled: false, name: '', path: '', arguments: '{url}' },
      localFile: {
        enabled: oldConfig.useCustomTool,
        name: oldConfig.customTool.name,
        path: oldConfig.customTool.path,
        arguments: oldConfig.customTool.arguments
      }
    }
  }
  return oldConfig
}
```

---

## 验收标准

1. ✅ 三种链接类型可独立配置启用/禁用
2. ✅ 每种类型可独立设置工具名称、路径、命令行参数
3. ✅ 打开链接时根据类型自动选择对应配置
4. ✅ 旧版本配置可平滑迁移
5. ✅ UI 上可分别测试每种类型
6. ✅ 编译通过，无 TypeScript 错误
