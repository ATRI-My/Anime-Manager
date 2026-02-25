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

## 未打包程序使用

### 已修复的问题
在本次更新中，修复了剧集管理中的输入框焦点问题：

#### 问题描述
在写入板块中，剧集管理里一旦使用了删除或批量删除功能，再打开添加新行的弹窗输入框就无法点击、输入。但这时点一下软件界面外的任意位置，就会恢复功能。

#### 修复内容
1. **修复了事件处理问题**：移除了阻止输入框获得焦点的事件处理器
2. **简化了焦点管理**：移除了复杂的焦点设置代码，改为简单的延迟焦点设置
3. **优化了状态管理**：避免了删除操作后不必要的全局状态刷新

### 如何运行未打包程序

#### 方法1：使用启动脚本（推荐）
1. 双击 `启动程序.bat`
2. 程序将自动启动

#### 方法2：手动运行
1. 进入 `dist-unpacked\win-unpacked\` 目录
2. 双击 `Anime Manager.exe`

#### 方法3：开发模式运行
```bash
npm run dev
```

### 文件结构
```
dist-unpacked/
└── win-unpacked/
    ├── Anime Manager.exe      # 主程序
    ├── resources/             # 资源文件
    │   ├── app.asar           # 打包的应用代码
    │   └── app.asar.unpacked/ # 解压的代码（包含dist目录）
    └── 其他依赖文件...
```

### 如何生成未打包程序
运行以下命令生成最新版本的未打包程序：

```bash
generate-unpacked.bat
```

或手动执行：

```bash
npm run build
npx electron-builder --dir --config.directories.output=dist-unpacked
```