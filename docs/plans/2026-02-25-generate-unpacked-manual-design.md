# 手动生成未打包程序 - 设计文档

## 项目背景
动漫管理器桌面应用（Electron + React）需要生成未打包程序以测试最新的剧集管理焦点问题修复。

## 需求分析
- **目的**：测试最新修复（剧集管理输入框焦点问题）
- **方式**：手动构建，非脚本自动化
- **输出**：完整的未打包程序（dist-unpacked目录）

## 设计概述
采用完整手动构建流程，分两步执行：
1. 构建项目代码（npm run build）
2. 生成未打包程序（electron-builder --dir）

## 详细设计

### 1. 构建准备
- 清理旧的构建目录（dist, dist-unpacked）
- 确保所有依赖已安装（npm install）
- 验证项目配置正确

### 2. 构建过程
**步骤1：构建项目**
```bash
npm run build
```
执行内容：
- TypeScript编译主进程代码（tsconfig.main.json）
- Vite构建前端代码（React + TailwindCSS）
- 生成dist目录结构

**步骤2：生成未打包程序**
```bash
npx electron-builder --dir --config.directories.output=dist-unpacked
```
生成内容：
- `dist-unpacked/win-unpacked/Anime Manager.exe`（主程序）
- 资源文件（app.asar, app.asar.unpacked）
- 运行时依赖文件

### 3. 输出验证
- 检查可执行文件存在性
- 验证文件大小（应大于50MB）
- 记录构建时间戳
- 验证目录结构完整

### 4. 测试方案
1. 运行生成的程序
2. 测试焦点问题修复：
   - 场景1：添加剧集 → 删除 → 再添加（输入框应正常）
   - 场景2：批量删除 → 添加新剧集（输入框应正常）
   - 场景3：多次重复删除和添加操作
   - 验证：光标在输入框中正常闪烁

## 文件结构
```
dist-unpacked/
└── win-unpacked/
    ├── Anime Manager.exe
    ├── resources/
    │   ├── app.asar
    │   └── app.asar.unpacked/
    │       └── dist/ (构建的代码)
    └── 其他依赖文件...
```

## 成功标准
1. 成功生成未打包程序到dist-unpacked目录
2. 可执行文件能正常启动
3. 剧集管理焦点问题已修复
4. 所有功能正常工作

## 风险与缓解
- **风险**：构建过程中断
  - **缓解**：分步执行，每一步验证成功后再继续
- **风险**：依赖问题
  - **缓解**：先运行npm install确保依赖完整
- **风险**：配置错误
  - **缓解**：检查package.json中的build配置

## 相关文件
- package.json：项目配置和构建脚本
- generate-unpacked.bat：自动化构建脚本（参考）
- README-未打包程序.md：使用说明

---
设计批准：已批准
设计时间：2026年2月25日
设计目标：手动生成未打包程序测试焦点修复