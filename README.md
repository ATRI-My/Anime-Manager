# Anime Manager

动漫资源管理器桌面应用，基于 Electron + React + TypeScript 构建。

## 功能特性

- 🎬 动漫资源管理
- 🔍 智能搜索和过滤
- 📁 文件系统集成
- 🎨 现代化用户界面
- ⚡ 高性能虚拟滚动
- 📊 数据统计和分析
- ⚠️ 未保存修改提示系统（新增）
- 💾 增强的保存状态显示（新增）
- 🛡️ 页面切换和应用关闭保护（新增）

## 快速开始

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 构建应用程序

#### 生成未打包版本（开发测试）
```bash
npm run build
npm run pack
```

未打包版本位于：`dist/win-unpacked/`

#### 生成安装包
```bash
npm run dist
```

## 项目结构

```
src/
├── main/           # Electron 主进程
├── renderer/       # React 渲染进程
└── shared/         # 共享代码
```

## 未打包版本使用

详细使用说明请查看：[docs/unpacked-usage.md](docs/unpacked-usage.md)

### 运行未打包版本
1. 构建应用程序：`npm run build`
2. 生成未打包版本：`npm run pack`
3. 运行：`dist/win-unpacked/Anime Manager.exe`

### 特点
- 无需安装，直接运行
- 包含完整运行时环境
- 便于测试和分发

## 开发指南

### 技术栈
- **前端**: React 18, TypeScript
- **构建工具**: Vite
- **桌面框架**: Electron
- **样式**: Tailwind CSS
- **打包**: electron-builder

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件化架构

### 测试
运行测试：
```bash
npm test
```

## 构建配置

### 主要配置
- `package.json` - 项目配置和脚本
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `electron-builder` - 应用程序打包配置

### 构建选项
- `npm run build` - 构建应用代码
- `npm run pack` - 生成未打包版本
- `npm run dist` - 生成安装包
- `npm run dist:win` - 生成 Windows 安装包

## 文档

- [设计文档](docs/plans/) - 项目设计和实施计划
- [使用说明](docs/unpacked-usage.md) - 未打包版本使用指南
- [测试报告](test-reports/) - 应用程序测试结果

## 新增功能说明

### 剧集编辑保存功能改进（2026-02-21）

**问题修复**：解决了用户编辑剧集后需要手动保存的问题，添加了明确的保存提示系统。

**新增功能**：
1. **未保存修改提示横幅** - 页面顶部显示黄色横幅，提示有未保存修改
2. **增强状态显示** - 文件状态栏显示"⚠️ 有未保存的修改"和"✓ 文件已保存"
3. **操作后Toast提示** - 编辑/添加/删除剧集后显示"修改已保存到内存"提示
4. **保存按钮高亮** - 有未保存修改时保存按钮变为蓝色高亮
5. **页面切换保护** - 离开页面时提示保存未保存的修改
6. **应用关闭保护** - 关闭应用时提示保存未保存的修改

**使用流程**：
1. 编辑剧集 → 点击"更新剧集"
2. 显示Toast："修改已保存到内存"
3. 状态栏变为："⚠️ 有未保存的修改"
4. 保存按钮高亮显示
5. 点击保存 → 数据持久化
6. 状态恢复："✓ 文件已保存"

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

## 许可证

MIT License