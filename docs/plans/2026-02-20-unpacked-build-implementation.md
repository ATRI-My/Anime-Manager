# Anime Manager 未打包版本生成实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Anime Manager 桌面应用生成未打包的 Windows 开发版本

**Architecture:** 使用 electron-builder 的 `--dir` 模式生成未打包的应用程序目录，包含完整的运行时环境和可执行文件

**Tech Stack:** Electron, React, TypeScript, Vite, electron-builder

---

### Task 1: 验证项目依赖和配置

**Files:**
- Check: `package.json`
- Check: `vite.config.ts`
- Check: `tsconfig.main.json`

**Step 1: 检查依赖安装状态**

```bash
npm list electron electron-builder vite typescript
```

**Step 2: 验证配置完整性**

检查 `package.json` 中的 `build` 配置和 `scripts` 部分

**Step 3: 确认构建目标**

验证 Windows 平台配置和输出目录设置

**Step 4: 提交配置检查**

```bash
git add package.json
git commit -m "chore: verify build configuration"
```

---

### Task 2: 构建应用程序代码

**Files:**
- Build: `src/main/`
- Build: `src/renderer/`
- Output: `dist/`

**Step 1: 运行构建命令**

```bash
npm run build
```

**Step 2: 验证构建输出**

```bash
dir dist\
```

检查是否生成以下目录：
- `dist/main/` - 主进程代码
- `dist/renderer/` - 渲染进程代码

**Step 3: 测试构建完整性**

```bash
node dist/main/index.js
```

预期：Electron 应用启动或显示相关日志

**Step 4: 提交构建结果**

```bash
git add dist/
git commit -m "build: compile application code"
```

---

### Task 3: 生成未打包的应用程序

**Files:**
- Modify: `package.json` (如果需要调整配置)
- Output: `dist/win-unpacked/`

**Step 1: 运行 electron-builder 的 dir 模式**

```bash
npm run pack
```

**Step 2: 验证应用程序目录**

```bash
dir dist\win-unpacked\
```

检查是否包含：
- `Anime Manager.exe` - 主可执行文件
- `resources/` - 应用资源
- 其他运行时文件

**Step 3: 检查文件完整性**

```bash
dir dist\win-unpacked\resources\app\
```

验证应用代码是否正确包含

**Step 4: 提交应用程序生成结果**

```bash
git add dist/win-unpacked/
git commit -m "build: generate unpacked application"
```

---

### Task 4: 测试应用程序功能

**Files:**
- Test: `dist/win-unpacked/Anime Manager.exe`
- Test: 应用程序功能

**Step 1: 启动应用程序**

```bash
start dist\win-unpacked\"Anime Manager.exe"
```

**Step 2: 验证基本功能**

手动测试：
1. 应用程序正常启动
2. 界面正确显示
3. 基本交互功能正常

**Step 3: 记录测试结果**

创建测试报告文件

**Step 4: 提交测试结果**

```bash
git add test-reports/
git commit -m "test: verify unpacked application functionality"
```

---

### Task 5: 创建使用说明文档

**Files:**
- Create: `docs/unpacked-usage.md`
- Update: `README.md`

**Step 1: 编写使用说明**

创建 `docs/unpacked-usage.md` 包含：
- 如何运行未打包版本
- 系统要求
- 故障排除

**Step 2: 更新主 README**

在 `README.md` 中添加未打包版本的说明

**Step 3: 验证文档完整性**

检查所有链接和说明是否正确

**Step 4: 提交文档**

```bash
git add docs/unpacked-usage.md README.md
git commit -m "docs: add unpacked application usage instructions"
```

---

### Task 6: 清理和优化

**Files:**
- Check: `dist/` 目录结构
- Update: `.gitignore` 如果需要

**Step 1: 检查输出目录结构**

```bash
tree dist\ /f
```

验证目录结构是否合理

**Step 2: 优化构建配置**

根据测试结果调整 `package.json` 中的构建配置

**Step 3: 更新 .gitignore**

确保不必要的中间文件被忽略

**Step 4: 最终提交**

```bash
git add .gitignore package.json
git commit -m "chore: finalize unpacked build configuration"
```

---

**计划完成！**

**执行选项：**

1. **Subagent-Driven (当前会话)** - 我分派新的子代理执行每个任务，任务间进行代码审查
2. **并行会话 (分离)** - 在新会话中使用 executing-plans 技能，批量执行并设置检查点

**选择哪种方式？**