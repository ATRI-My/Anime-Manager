# Task 3: React渲染进程基础结构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完善React渲染进程基础结构，包括共享类型、工具函数、常量和现有React文件

**Architecture:** 完善types.ts中的接口定义，创建utils.ts实现工具函数，创建constants.ts定义常量，完善现有React文件

**Tech Stack:** TypeScript 5, React 18, Electron 25

---

### Task 1: 完善共享类型定义

**Files:**
- Modify: `src/shared/types.ts:1-37`

**Step 1: 检查现有类型定义**

检查现有类型是否完整，根据设计文档添加缺失的字段

**Step 2: 完善Episode接口**

添加缺失字段：duration（时长）、filePath（文件路径）

**Step 3: 完善Anime接口**

添加缺失字段：coverImage（封面图片）、status（状态）、rating（评分）

**Step 4: 完善AppData接口**

添加缺失字段：settings（设置）、lastSync（最后同步时间）

**Step 5: 完善ToolConfig接口**

添加缺失字段：defaultTool（默认工具）、enabled（是否启用）

**Step 6: 完善Settings接口**

添加缺失字段：theme（主题）、language（语言）、autoSave（自动保存）

**Step 7: 验证类型定义**

运行TypeScript检查：`npx tsc --noEmit`

---

### Task 2: 创建工具函数文件

**Files:**
- Create: `src/shared/utils.ts`

**Step 1: 创建基础工具函数**

实现ID生成函数：`generateId()`

**Step 2: 实现日期格式化函数**

实现`formatDate(date: Date): string`

**Step 3: 实现URL验证函数**

实现`isValidUrl(url: string): boolean`

**Step 4: 实现模糊搜索算法**

根据设计文档实现`fuzzySearch(query: string, animeList: Anime[]): Anime[]`

**Step 5: 添加工具函数导出**

导出所有工具函数

**Step 6: 验证工具函数**

创建简单的测试验证函数正常工作

---

### Task 3: 创建常量定义文件

**Files:**
- Create: `src/shared/constants.ts`

**Step 1: 定义默认应用数据**

创建`DEFAULT_APP_DATA: AppData`常量

**Step 2: 定义观看方式列表**

创建`WATCH_METHODS: string[]`常量

**Step 3: 定义默认设置**

创建`DEFAULT_SETTINGS: Settings`常量

**Step 4: 定义其他常量**

创建`APP_VERSION`、`SUPPORTED_FILE_TYPES`等常量

**Step 5: 导出所有常量**

**Step 6: 验证常量定义**

确保类型正确

---

### Task 4: 完善React文件

**Files:**
- Modify: `index.html:1-13`
- Modify: `src/renderer/index.tsx:1-16`
- Modify: `src/renderer/App.tsx:1-44`
- Modify: `src/renderer/index.css:1-3`

**Step 1: 完善index.html**

添加meta标签、favicon、viewport设置

**Step 2: 完善index.tsx**

确保React正确初始化，添加错误处理

**Step 3: 完善App.tsx**

更新应用界面，展示实际功能

**Step 4: 完善index.css**

添加基础样式

**Step 5: 验证React应用**

运行开发服务器：`npm run dev`

---

### Task 5: 自我审查和验证

**Step 1: 运行TypeScript检查**

`npx tsc --noEmit`

**Step 2: 运行开发服务器**

`npm run dev` 验证应用启动正常

**Step 3: 检查文件结构**

确保所有文件都已创建和完善

**Step 4: 验证功能**

测试工具函数和常量是否正确工作

---

**完整实施计划已保存。两个执行选项：**

1. **子代理驱动（本次会话）** - 我分派新子代理处理每个任务，任务间进行代码审查，快速迭代

2. **并行会话（单独）** - 在新会话中使用executing-plans技能，批量执行并设置检查点

**选择哪种方法？**