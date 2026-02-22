# ToolConfigForm.tsx 重写实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完全重写 ToolConfigForm.tsx 组件，实现工具配置表单功能，包含工具类型选择、自定义工具设置、文件浏览、工具测试和设置保存功能。

**Architecture:** 基于现有的 ToolConfig 类型和 useSettings hook，创建新的表单组件，使用 React hooks 管理状态，集成 Electron API 进行文件浏览和工具测试。

**Tech Stack:** React, TypeScript, Tailwind CSS, Electron API

---

### Task 1: 分析现有代码和类型定义

**Files:**
- Read: `src/renderer/components/common/ToolConfigForm.tsx`
- Read: `src/shared/types.ts:26-38`
- Read: `src/renderer/hooks/useSettings.ts`
- Read: `src/main/preload.ts:17-36`

**Step 1: 查看现有组件结构**
分析当前 ToolConfigForm.tsx 的组件结构和 props

**Step 2: 查看 ToolConfig 类型定义**
确认 ToolConfig 接口结构：
```typescript
export interface ToolConfig {
  useCustomTool: boolean
  customTool: {
    name: string
    path: string
    arguments: string
  }
  lastTestResult?: {
    success: boolean
    message: string
    timestamp: string
  }
}
```

**Step 3: 查看 useSettings hook**
了解如何加载和保存设置

**Step 4: 查看 Electron API**
确认可用的文件对话框和工具打开 API

---

### Task 2: 设计新组件结构

**Files:**
- Create: `src/renderer/components/common/ToolConfigForm.tsx` (新版本)

**Step 1: 设计组件 props 接口**
```typescript
interface ToolConfigFormProps {
  className?: string;
  onSave?: (config: ToolConfig) => void;
  onTest?: (config: ToolConfig) => Promise<{ success: boolean; message: string }>;
}
```

**Step 2: 设计组件状态接口**
```typescript
interface ToolConfigFormState {
  config: ToolConfig;
  loading: boolean;
  testing: boolean;
  showPath: boolean;
  lastTestResult?: {
    success: boolean;
    message: string;
    timestamp: string;
  };
}
```

**Step 3: 设计表单字段**
1. 工具类型选择（单选按钮组）
2. 自定义工具名称（文本输入）
3. 工具路径（文本输入 + 浏览按钮）
4. 命令行参数（文本输入）
5. 测试按钮和结果显示
6. 保存按钮

---

### Task 3: 实现基础组件框架

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 创建基础组件结构**
```typescript
import React, { useState, useEffect } from 'react';
import { ToolConfig } from '../../../shared/types';
import { useSettings } from '../../hooks/useSettings';

interface ToolConfigFormProps {
  className?: string;
}

const ToolConfigForm: React.FC<ToolConfigFormProps> = ({ className = '' }) => {
  const { settings, updateToolConfig, loading: settingsLoading } = useSettings();
  const [config, setConfig] = useState<ToolConfig>({
    useCustomTool: false,
    customTool: {
      name: '',
      path: '',
      arguments: ''
    }
  });
  const [testing, setTesting] = useState(false);
  const [showPath, setShowPath] = useState(false);

  // 初始化配置
  useEffect(() => {
    if (settings?.toolConfig) {
      setConfig(settings.toolConfig);
    }
  }, [settings]);

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateToolConfig(config);
    // 显示保存结果
  };

  // 工具测试处理
  const handleTestTool = async () => {
    setTesting(true);
    try {
      const result = await (window as any).electronAPI.openWithTool(
        'https://www.google.com',
        config
      );
      // 更新测试结果
    } finally {
      setTesting(false);
    }
  };

  // 文件浏览处理
  const handleBrowseFile = async () => {
    try {
      const result = await (window as any).electronAPI.openFileDialog();
      if (!result.canceled && result.filePaths.length > 0) {
        setConfig({
          ...config,
          customTool: {
            ...config.customTool,
            path: result.filePaths[0]
          }
        });
      }
    } catch (error) {
      console.error('文件浏览失败:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* 表单内容将在后续任务中实现 */}
    </form>
  );
};

export default ToolConfigForm;
```

---

### Task 4: 实现工具类型选择部分

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加工具类型选择字段**
```jsx
<div className="space-y-4">
  <h3 className="text-lg font-medium text-gray-900">工具类型</h3>
  <div className="space-y-2">
    <div className="flex items-center">
      <input
        type="radio"
        id="defaultBrowser"
        name="toolType"
        checked={!config.useCustomTool}
        onChange={() => setConfig({ ...config, useCustomTool: false })}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <label htmlFor="defaultBrowser" className="ml-3 block text-sm font-medium text-gray-700">
        系统默认浏览器
      </label>
    </div>
    <div className="flex items-center">
      <input
        type="radio"
        id="customTool"
        name="toolType"
        checked={config.useCustomTool}
        onChange={() => setConfig({ ...config, useCustomTool: true })}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <label htmlFor="customTool" className="ml-3 block text-sm font-medium text-gray-700">
        自定义工具
      </label>
    </div>
  </div>
</div>
```

---

### Task 5: 实现自定义工具设置部分

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加自定义工具设置字段（条件渲染）**
```jsx
{config.useCustomTool && (
  <div className="space-y-4 border-t pt-4">
    <h3 className="text-lg font-medium text-gray-900">自定义工具设置</h3>
    
    {/* 工具名称 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        工具名称
      </label>
      <input
        type="text"
        value={config.customTool.name}
        onChange={(e) => setConfig({
          ...config,
          customTool: { ...config.customTool, name: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="例如：Chrome浏览器"
      />
    </div>

    {/* 工具路径 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        工具路径
      </label>
      <div className="flex space-x-2">
        <input
          type={showPath ? "text" : "password"}
          value={config.customTool.path}
          onChange={(e) => setConfig({
            ...config,
            customTool: { ...config.customTool, path: e.target.value }
          })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="工具可执行文件路径"
        />
        <button
          type="button"
          onClick={() => setShowPath(!showPath)}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {showPath ? "隐藏" : "显示"}
        </button>
        <button
          type="button"
          onClick={handleBrowseFile}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          浏览
        </button>
      </div>
    </div>

    {/* 命令行参数 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        命令行参数
      </label>
      <input
        type="text"
        value={config.customTool.arguments}
        onChange={(e) => setConfig({
          ...config,
          customTool: { ...config.customTool, arguments: e.target.value }
        })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="例如：--new-window %URL%"
      />
      <p className="mt-1 text-sm text-gray-500">使用 %URL% 作为URL占位符</p>
    </div>
  </div>
)}
```

---

### Task 6: 实现工具测试功能

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加测试按钮和结果显示**
```jsx
<div className="space-y-4 border-t pt-4">
  <h3 className="text-lg font-medium text-gray-900">工具测试</h3>
  
  <div className="flex items-center space-x-4">
    <button
      type="button"
      onClick={handleTestTool}
      disabled={testing}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {testing ? '测试中...' : '测试工具'}
    </button>
    <span className="text-sm text-gray-500">测试URL: https://www.google.com</span>
  </div>

  {/* 测试结果显示 */}
  {config.lastTestResult && (
    <div className={`p-3 rounded-md ${config.lastTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${config.lastTestResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`font-medium ${config.lastTestResult.success ? 'text-green-800' : 'text-red-800'}`}>
          {config.lastTestResult.success ? '测试成功' : '测试失败'}
        </span>
      </div>
      <p className={`text-sm mt-1 ${config.lastTestResult.success ? 'text-green-700' : 'text-red-700'}`}>
        {config.lastTestResult.message}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        测试时间: {new Date(config.lastTestResult.timestamp).toLocaleString()}
      </p>
    </div>
  )}
</div>
```

**Step 2: 完善测试处理函数**
```typescript
const handleTestTool = async () => {
  setTesting(true);
  try {
    const result = await (window as any).electronAPI.openWithTool(
      'https://www.google.com',
      config
    );
    
    const testResult = {
      success: result.success,
      message: result.success ? '工具成功打开测试URL' : result.error || '工具打开失败',
      timestamp: new Date().toISOString()
    };
    
    setConfig({
      ...config,
      lastTestResult: testResult
    });
    
    // 自动保存测试结果
    await updateToolConfig({
      ...config,
      lastTestResult: testResult
    });
    
  } catch (error) {
    const testResult = {
      success: false,
      message: error instanceof Error ? error.message : '测试过程中发生错误',
      timestamp: new Date().toISOString()
    };
    
    setConfig({
      ...config,
      lastTestResult: testResult
    });
  } finally {
    setTesting(false);
  }
};
```

---

### Task 7: 实现保存功能和状态显示

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加保存按钮和状态显示**
```jsx
<div className="flex justify-between pt-4 border-t border-gray-200">
  <div className="text-sm text-gray-500">
    {settingsLoading ? '加载中...' : '当前配置已保存'}
  </div>
  
  <div className="flex space-x-4">
    <button
      type="button"
      onClick={() => {
        if (settings?.toolConfig) {
          setConfig(settings.toolConfig);
        }
      }}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
    >
      重置
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      保存配置
    </button>
  </div>
</div>
```

**Step 2: 完善表单提交处理**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = await updateToolConfig(config);
  
  // 显示保存结果通知
  if (result.success) {
    // 可以添加成功提示
    console.log('配置保存成功');
  } else {
    // 可以添加错误提示
    console.error('配置保存失败:', result.error);
  }
};
```

---

### Task 8: 添加配置说明和帮助信息

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加配置说明区域**
```jsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <h4 className="font-medium text-blue-800 mb-2">配置说明</h4>
  <ul className="text-sm text-blue-700 space-y-1">
    <li>• <strong>系统默认浏览器</strong>: 使用操作系统默认浏览器打开URL</li>
    <li>• <strong>自定义工具</strong>: 指定特定的可执行文件打开URL</li>
    <li>• <strong>工具路径</strong>: 可执行文件的完整路径（支持浏览选择）</li>
    <li>• <strong>命令行参数</strong>: 使用 %URL% 作为URL占位符</li>
    <li>• <strong>工具测试</strong>: 使用 https://www.google.com 测试工具配置</li>
  </ul>
</div>
```

---

### Task 9: 添加加载状态和错误处理

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 添加加载状态显示**
```jsx
if (settingsLoading) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-gray-500">加载配置中...</div>
    </div>
  );
}

if (error) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <div className="text-red-800 font-medium">加载配置失败</div>
      <p className="text-red-700 text-sm mt-1">{error}</p>
      <button
        onClick={loadSettings}
        className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
      >
        重试
      </button>
    </div>
  );
}
```

**Step 2: 在 useSettings hook 中添加错误状态**
（如果 useSettings 没有 error 状态，需要添加）

---

### Task 10: 测试和验证

**Files:**
- Test: 手动测试组件功能

**Step 1: 启动开发服务器**
```bash
npm run dev
```

**Step 2: 测试功能点**
1. 工具类型切换功能
2. 文件浏览功能
3. 工具测试功能
4. 配置保存功能
5. 状态显示功能

**Step 3: 验证类型安全**
```bash
npm run typecheck
```

**Step 4: 验证代码格式**
```bash
npm run lint
```

---

### Task 11: 清理和优化

**Files:**
- Modify: `src/renderer/components/common/ToolConfigForm.tsx`

**Step 1: 移除旧代码中不需要的部分**
确保完全替换原有的API配置功能

**Step 2: 优化代码结构**
提取重复的逻辑到自定义hooks或工具函数

**Step 3: 添加注释**
为复杂逻辑添加必要的注释

---

**计划完成。执行选项：**

**1. Subagent-Driven (当前会话)** - 我按任务分派子代理，任务间进行代码审查，快速迭代

**2. 并行会话 (分离)** - 在新会话中使用 executing-plans，批量执行并设置检查点

**选择哪种方式？**