# 手动构建未打包程序指南

## 概述
本文档提供手动构建未打包 Anime 管理程序的详细步骤。未打包程序无需安装，可直接运行，适合快速测试和部署。

## 构建环境要求
- Node.js 18+ 
- npm 9+
- Windows 系统（批处理脚本为 Windows 编写）

## 构建步骤

### 1. 准备项目
```bash
# 克隆或下载项目代码
git clone <repository-url>
cd anime

# 安装依赖
npm install
```

### 2. 构建主进程代码
```bash
# 使用 TypeScript 编译主进程代码
npx tsc --project tsconfig.main.json

# 或使用批处理脚本
scripts\build-main.bat
```

### 3. 构建渲染进程代码
```bash
# 使用 Vite 构建渲染进程
npm run build

# 构建输出到 dist 目录
```

### 4. 创建未打包程序结构
```bash
# 运行手动构建脚本
generate-unpacked.bat

# 或手动执行以下步骤：
# 1. 创建 dist-unpacked 目录
# 2. 复制主进程文件
# 3. 复制渲染进程文件
# 4. 复制 package.json 和依赖
# 5. 创建启动脚本
```

### 5. 验证构建结果
```bash
# 运行测试脚本验证程序功能
test-unpacked.bat

# 检查输出文件 test-unpacked-results.md
```

## 目录结构说明
```
dist-unpacked/
├── main.js                    # 主进程入口
├── preload.js                 # 预加载脚本
├── index.html                 # 主页面
├── assets/                    # 静态资源
│   ├── index-*.js
│   ├── index-*.css
│   └── *.png
├── package.json               # 项目配置
├── node_modules/              # 依赖包
└── run-unpacked.bat          # Windows 启动脚本
```

## 手动构建脚本详解

### generate-unpacked.bat
```batch
@echo off
REM 创建未打包程序目录结构
REM 复制主进程文件
REM 复制渲染进程文件  
REM 安装生产依赖
REM 创建启动脚本
```

### 关键文件说明
1. **main.js** - Electron 主进程入口，处理窗口创建和系统事件
2. **preload.js** - 安全通信桥梁，暴露有限的 API 给渲染进程
3. **index.html** - 应用主界面，加载渲染进程代码
4. **run-unpacked.bat** - Windows 启动脚本，设置环境并启动程序

## 故障排除

### 常见问题
1. **启动失败：找不到模块**
   - 确保 node_modules 已正确复制
   - 运行 `npm install --production` 重新安装依赖

2. **界面加载失败**
   - 检查 assets 目录文件是否完整
   - 验证 index.html 中的资源路径

3. **数据保存问题**
   - 确保程序有文件系统写入权限
   - 检查 anime-data.json 文件位置

### 调试方法
```bash
# 启用开发者工具
# 在 main.js 中取消注释 mainWindow.webContents.openDevTools()

# 查看控制台日志
# 程序启动时会输出日志到控制台
```

## 更新维护

### 更新程序版本
1. 修改 package.json 中的版本号
2. 重新执行构建步骤 2-4
3. 更新 README-未打包程序.md 中的构建信息

### 添加新功能
1. 在 src/ 目录开发新功能
2. 测试功能正常
3. 重新构建并更新未打包程序

## 构建时间记录
- 本次构建时间：2026年2月25日
- 构建版本：v1.0.0-focus-fix-v2
- Electron 版本：25.9.8
- 包含修复：剧集管理输入框焦点问题

## 相关文档
- [README-未打包程序.md](../README-未打包程序.md) - 未打包程序使用说明
- [unpacked-usage.md](./unpacked-usage.md) - 未打包程序使用指南
- [test-unpacked-results.md](../test-unpacked-results.md) - 测试结果记录