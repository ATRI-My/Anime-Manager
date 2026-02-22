# Anime Manager 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个完整的动漫资源管理器桌面应用，支持查询、编辑和设置三大功能板块

**Architecture:** Electron主进程处理文件系统和系统调用，React渲染进程提供用户界面，TypeScript确保类型安全，JSON文件存储数据，Tailwind CSS提供样式

**Tech Stack:** Electron 25, React 18, TypeScript 5, Vite 4, Tailwind CSS 3, electron-builder 24

---

## 第一阶段：基础框架搭建

### Task 1: 初始化项目结构和package.json
**Files:** `package.json`, `tsconfig.json`, `tsconfig.main.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`
**步骤:** 创建配置文件，安装依赖，验证安装

### Task 2: 创建Electron主进程文件
**Files:** `src/main/index.ts`, `src/main/preload.ts`, `src/main/file-system.ts`
**步骤:** 创建主进程入口，预加载脚本，文件系统API

### Task 3: 创建React渲染进程基础结构
**Files:** `index.html`, `src/renderer/index.tsx`, `src/renderer/App.tsx`, `src/renderer/styles/index.css`, `src/shared/types.ts`, `src/shared/utils.ts`, `src/shared/constants.ts`
**步骤:** 创建React应用入口，基础组件，共享类型和工具函数

### Task 4: 创建组件目录结构
**Files:** 三大页面组件和通用组件文件
**步骤:** 创建查询、写入、设置页面组件和通用组件占位符

## 第二阶段：核心功能开发

### Task 5: 实现查询板块核心组件
**Files:** `AnimeCard.tsx`, `EpisodeList.tsx`, `useAnimeData.ts`, `useSettings.ts`
**步骤:** 实现番剧卡片、剧集列表组件，创建数据管理hooks

### Task 6: 实现写入板块核心组件
**Files:** `FileOperations.tsx`, `AnimeForm.tsx`, `EpisodeTable.tsx`
**步骤:** 实现文件操作、番剧表单、剧集表格组件

### Task 7: 实现设置板块核心组件
**Files:** `ToolConfigForm.tsx`
**步骤:** 实现工具配置表单，集成设置保存功能

### Task 8: 集成数据流和状态管理
**步骤:** 连接所有组件，实现完整的数据流和状态管理

## 第三阶段：集成与优化

### Task 9: 添加错误处理和用户反馈
**步骤:** 实现加载状态、错误提示、成功反馈

### Task 10: 优化性能和用户体验
**步骤:** 实现虚拟滚动、搜索优化、界面优化

### Task 11: 添加数据验证和测试
**步骤:** 实现表单验证，添加基础测试

## 第四阶段：打包发布

### Task 12: 配置打包和发布
**步骤:** 配置electron-builder，生成可执行文件，测试安装

---

**完整实施计划已保存。两个执行选项：**

1. **子代理驱动（本次会话）** - 我分派新子代理处理每个任务，任务间进行代码审查，快速迭代

2. **并行会话（单独）** - 在新会话中使用executing-plans技能，批量执行并设置检查点

**选择哪种方法？**