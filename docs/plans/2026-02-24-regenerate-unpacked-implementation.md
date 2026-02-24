# 重新生成未打包程序实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建专用脚本生成包含最新焦点修复的未打包程序到dist-unpacked目录

**Architecture:** 基于现有pack-temp.bat脚本修改，创建专用的generate-unpacked.bat脚本，包含完整的构建、打包、验证流程

**Tech Stack:** Electron, React, TypeScript, Vite, electron-builder, Windows Batch Script

---

## 实施计划

### Task 1: 创建生成脚本

**Files:**
- Create: `generate-unpacked.bat`

**Step 1: 创建基础脚本框架**

```batch
@echo off
echo 生成未打包程序 (dist-unpacked)
echo.
echo 包含最新的焦点问题修复
echo.

REM 设置错误处理
setlocal enabledelayedexpansion
```

**Step 2: 添加预处理逻辑**

```batch
REM 1. 停止Electron进程
echo 停止正在运行的Electron进程...
taskkill /F /IM electron.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM 2. 清理旧的构建目录
echo 清理旧的构建目录...
if exist "dist-unpacked" rmdir /S /Q "dist-unpacked" >nul 2>&1
if exist "dist" rmdir /S /Q "dist" >nul 2>&1
```

**Step 3: 添加构建逻辑**

```batch
REM 3. 构建项目
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)
```

**Step 4: 添加打包逻辑**

```batch
REM 4. 生成未打包程序
echo 生成未打包程序...
npx electron-builder --dir --config.directories.output=dist-unpacked
if %errorlevel% neq 0 (
    echo 打包失败！
    pause
    exit /b 1
)
```

**Step 5: 添加验证和输出逻辑**

```batch
REM 5. 验证结果
if exist "dist-unpacked\win-unpacked\Anime Manager.exe" (
    echo ✓ 未打包程序生成成功！
    echo 可执行文件: dist-unpacked\win-unpacked\Anime Manager.exe
    echo.
    echo 包含的修复：
    echo - 剧集管理输入框焦点问题修复
    echo - 简化焦点管理逻辑
    echo - 删除操作后焦点清除
    echo.
    echo 运行方式：
    echo 1. 双击 "启动程序.bat"
    echo 2. 或直接运行 "dist-unpacked\win-unpacked\Anime Manager.exe"
) else (
    echo ✗ 生成失败，可执行文件不存在
    pause
    exit /b 1
)

echo.
echo 完成！未打包程序已生成到 dist-unpacked 目录。
pause
```

**Step 6: 测试脚本语法**

Run: `cmd /c "generate-unpacked.bat /?"`
Expected: 显示脚本帮助信息或执行

**Step 7: 提交脚本**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加未打包程序生成脚本"
```

### Task 2: 更新README文档

**Files:**
- Modify: `README-未打包程序.md:46-48`

**Step 1: 更新构建信息**

```markdown
## 构建信息
- 构建时间：2026年2月24日
- 修复版本：v1.0.0-focus-fix-v2
- Electron版本：25.9.8
- 包含修复：剧集管理输入框焦点问题
```

**Step 2: 添加生成说明**

```markdown
## 如何生成未打包程序

运行以下命令生成最新版本的未打包程序：

```bash
generate-unpacked.bat
```

或手动执行：

```bash
npm run build
npx electron-builder --dir --config.directories.output=dist-unpacked
```
```

**Step 3: 更新测试步骤**

```markdown
## 测试修复
请测试以下场景以确保焦点问题已修复：
1. 添加剧集 → 删除剧集 → 再次添加新剧集（输入框应该能正常点击和输入）
2. 批量删除剧集 → 添加新剧集（输入框应该能正常点击和输入）
3. 多次重复删除和添加操作，确保稳定性
4. 验证光标在输入框中正常闪烁
```

**Step 4: 验证文档格式**

Run: 在编辑器中预览Markdown格式
Expected: 格式正确，无语法错误

**Step 5: 提交文档更新**

```bash
git add README-未打包程序.md
git commit -m "docs: 更新未打包程序文档"
```

### Task 3: 测试生成脚本

**Files:**
- Test: `generate-unpacked.bat`

**Step 1: 运行生成脚本**

Run: `generate-unpacked.bat`
Expected: 脚本开始执行，显示构建进度

**Step 2: 验证构建过程**

观察输出：
- "停止正在运行的Electron进程" ✓
- "清理旧的构建目录" ✓
- "构建项目" ✓
- "生成未打包程序" ✓
- "未打包程序生成成功" ✓

**Step 3: 验证生成的文件**

Run: `dir dist-unpacked\win-unpacked\`
Expected: 包含 Anime Manager.exe 和其他文件

**Step 4: 验证可执行文件**

Run: `dist-unpacked\win-unpacked\Anime Manager.exe`
Expected: 程序正常启动

**Step 5: 提交测试结果**

```bash
git add .
git commit -m "test: 验证未打包程序生成脚本"
```

### Task 4: 验证焦点问题修复

**Files:**
- Test: 运行生成的程序

**Step 1: 启动程序**

Run: 双击 `dist-unpacked\win-unpacked\Anime Manager.exe`
Expected: 程序正常启动，显示主界面

**Step 2: 测试焦点问题修复场景1**

操作：
1. 进入"写入"板块
2. 选择一个番剧
3. 添加一个剧集
4. 删除该剧集
5. 立即点击"添加新行"按钮
6. 尝试在输入框中输入

Expected: 输入框可以正常获得焦点，可以输入文本

**Step 3: 测试焦点问题修复场景2**

操作：
1. 添加多个剧集
2. 批量删除这些剧集
3. 立即点击"添加新行"按钮
4. 尝试在输入框中输入

Expected: 输入框可以正常获得焦点，可以输入文本

**Step 4: 验证其他功能正常**

操作：
1. 测试番剧添加/编辑/删除
2. 测试文件保存/加载
3. 测试查询功能

Expected: 所有核心功能正常工作

**Step 5: 记录测试结果**

```bash
git add test-focus-fix-summary.md
git commit -m "test: 验证焦点问题修复"
```

### Task 5: 创建启动脚本（可选）

**Files:**
- Create: `启动未打包程序.bat`

**Step 1: 创建启动脚本**

```batch
@echo off
echo 启动未打包程序 (dist-unpacked)
echo.

if exist "dist-unpacked\win-unpacked\Anime Manager.exe" (
    echo 正在启动程序...
    start "" "dist-unpacked\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo 错误：未找到 Anime Manager.exe
    echo 请先运行 generate-unpacked.bat 生成程序
)

echo.
pause
```

**Step 2: 测试启动脚本**

Run: `启动未打包程序.bat`
Expected: 程序正常启动

**Step 3: 提交启动脚本**

```bash
git add 启动未打包程序.bat
git commit -m "feat: 添加未打包程序启动脚本"
```

## 执行选项

计划已完成并保存到 `docs/plans/2026-02-24-regenerate-unpacked-implementation.md`。

**两个执行选项：**

1. **Subagent-Driven (当前会话)** - 我分派新的子代理执行每个任务，任务间进行代码审查，快速迭代

2. **并行会话 (分离)** - 在新的工作树中打开新会话，使用executing-plans进行批量执行和检查点

**您选择哪种方法？**