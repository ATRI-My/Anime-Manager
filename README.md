# 动漫管理工具

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