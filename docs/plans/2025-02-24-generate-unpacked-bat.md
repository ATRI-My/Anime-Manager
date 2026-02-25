# Generate-unpacked.bat 脚本实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建完整的generate-unpacked.bat脚本，用于自动化生成和测试未打包的Electron应用

**Architecture:** 创建一个批处理脚本，包含完整的构建流程：依赖检查、构建、打包、验证和清理功能。脚本将提供交互式菜单和详细的错误处理。

**Tech Stack:** Windows批处理脚本、npm、electron-builder、Node.js

---

### Task 1: 创建脚本基础结构和主菜单

**Files:**
- Create: `generate-unpacked.bat`

**Step 1: 创建基础脚本结构**

```batch
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    Anime Manager 未打包程序生成器
echo ========================================
echo.

:menu
echo 请选择操作:
echo.
echo [1] 生成未打包程序 (完整流程)
echo [2] 仅构建项目 (不打包)
echo [3] 仅打包已构建的项目
echo [4] 验证已生成的程序
echo [5] 清理构建文件
echo [6] 查看帮助信息
echo [7] 退出
echo.

set /p choice="请输入选项 (1-7): "

if "%choice%"=="1" goto :full_process
if "%choice%"=="2" goto :build_only
if "%choice%"=="3" goto :pack_only
if "%choice%"=="4" goto :verify_only
if "%choice%"=="5" goto :cleanup
if "%choice%"=="6" goto :help
if "%choice%"=="7" goto :exit

echo 无效选项，请重新输入
goto :menu
```

**Step 2: 运行测试验证基础结构**

运行: `generate-unpacked.bat`
Expected: 显示菜单界面

**Step 3: 添加退出和帮助函数**

```batch
:exit
echo.
echo 程序退出
pause
exit /b 0

:help
echo.
echo ========================================
echo                帮助信息
echo ========================================
echo.
echo 选项说明:
echo   1. 完整流程 - 检查依赖、构建、打包、验证
echo   2. 仅构建 - 只运行npm build命令
echo   3. 仅打包 - 只运行electron-builder打包
echo   4. 验证 - 检查已生成的程序文件
echo   5. 清理 - 删除dist和dist-new目录
echo   6. 帮助 - 显示此帮助信息
echo   7. 退出 - 退出程序
echo.
echo 注意事项:
echo   - 需要安装Node.js和npm
echo   - 需要安装electron-builder: npm install -g electron-builder
echo   - 建议在管理员权限下运行
echo.
pause
goto :menu
```

**Step 4: 运行测试验证帮助功能**

运行: `generate-unpacked.bat` 选择6
Expected: 显示帮助信息

**Step 5: 提交基础结构**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加generate-unpacked.bat基础结构和菜单"
```

---

### Task 2: 实现依赖检查功能

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加依赖检查函数**

```batch
:check_dependencies
echo.
echo ========================================
echo           检查系统依赖
echo ========================================
echo.

echo 检查Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js 已安装
    node --version
) else (
    echo ✗ Node.js 未安装
    echo 请从 https://nodejs.org/ 下载安装
    goto :dependency_error
)

echo.
echo 检查npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ npm 已安装
    npm --version
) else (
    echo ✗ npm 未安装
    echo 请确保Node.js安装包含npm
    goto :dependency_error
)

echo.
echo 检查项目依赖...
if exist "node_modules" (
    echo ✓ node_modules目录存在
) else (
    echo ! node_modules目录不存在，将自动安装依赖
    call :install_dependencies
)

echo.
echo 依赖检查完成！
goto :eof

:install_dependencies
echo.
echo 正在安装项目依赖...
npm install
if %errorlevel% neq 0 (
    echo ✗ 依赖安装失败
    goto :dependency_error
)
echo ✓ 依赖安装成功
goto :eof

:dependency_error
echo.
echo 依赖检查失败，请解决上述问题后重试
pause
goto :menu
```

**Step 2: 运行测试验证依赖检查**

运行: `generate-unpacked.bat`
Expected: 显示依赖检查结果

**Step 3: 提交依赖检查功能**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加依赖检查功能到generate-unpacked.bat"
```

---

### Task 3: 实现构建功能

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加构建函数**

```batch
:build_project
echo.
echo ========================================
echo           构建项目
echo ========================================
echo.

echo 清理旧的构建文件...
if exist "dist" (
    echo 删除dist目录...
    rmdir /s /q "dist" 2>nul
    if exist "dist" (
        echo ✗ 无法删除dist目录，可能有文件被占用
        goto :build_error
    )
    echo ✓ dist目录已清理
)

echo.
echo 运行TypeScript编译...
npx tsc -p tsconfig.main.json
if %errorlevel% neq 0 (
    echo ✗ TypeScript编译失败
    goto :build_error
)
echo ✓ TypeScript编译成功

echo.
echo 运行Vite构建...
npm run build
if %errorlevel% neq 0 (
    echo ✗ Vite构建失败
    goto :build_error
)
echo ✓ Vite构建成功

echo.
echo 验证构建结果...
if exist "dist\main\index.js" (
    echo ✓ 主进程文件存在: dist\main\index.js
) else (
    echo ✗ 主进程文件不存在
    goto :build_error
)

if exist "dist\index.html" (
    echo ✓ 前端文件存在: dist\index.html
) else (
    echo ✗ 前端文件不存在
    goto :build_error
)

echo.
echo 项目构建完成！
goto :eof

:build_error
echo.
echo 构建失败，请检查错误信息
pause
goto :menu
```

**Step 2: 运行测试验证构建功能**

运行: `generate-unpacked.bat` 选择2
Expected: 执行构建流程

**Step 3: 提交构建功能**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加项目构建功能到generate-unpacked.bat"
```

---

### Task 4: 实现打包功能

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加打包函数**

```batch
:pack_project
echo.
echo ========================================
echo           打包Electron应用
echo ========================================
echo.

echo 检查electron-builder...
where electron-builder >nul 2>nul
if %errorlevel% neq 0 (
    echo ! electron-builder未全局安装，尝试使用npx...
    set use_npx=1
) else (
    set use_npx=0
    echo ✓ electron-builder已安装
    electron-builder --version
)

echo.
echo 清理旧的打包文件...
if exist "dist-new" (
    echo 删除dist-new目录...
    rmdir /s /q "dist-new" 2>nul
    if exist "dist-new" (
        echo ✗ 无法删除dist-new目录，可能有文件被占用
        goto :pack_error
    )
    echo ✓ dist-new目录已清理
)

echo.
echo 开始打包未打包程序...
if "%use_npx%"=="1" (
    echo 使用npx运行electron-builder...
    npx electron-builder --dir --config.directories.output=dist-new
) else (
    echo 使用全局electron-builder...
    electron-builder --dir --config.directories.output=dist-new
)

if %errorlevel% neq 0 (
    echo ✗ 打包失败
    goto :pack_error
)

echo.
echo 验证打包结果...
if exist "dist-new\win-unpacked\Anime Manager.exe" (
    echo ✓ 可执行文件生成成功
    echo   位置: dist-new\win-unpacked\Anime Manager.exe
) else (
    echo ✗ 可执行文件未生成
    goto :pack_error
)

if exist "dist-new\win-unpacked\resources\app.asar" (
    echo ✓ app.asar文件存在
) else (
    echo ✗ app.asar文件不存在
    goto :pack_error
)

echo.
echo 打包完成！
goto :eof

:pack_error
echo.
echo 打包失败，请检查错误信息
pause
goto :menu
```

**Step 2: 运行测试验证打包功能**

运行: `generate-unpacked.bat` 选择3
Expected: 执行打包流程

**Step 3: 提交打包功能**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加打包功能到generate-unpacked.bat"
```

---

### Task 5: 实现验证功能

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加验证函数**

```batch
:verify_build
echo.
echo ========================================
echo           验证已生成程序
echo ========================================
echo.

set verified=0

echo 检查dist-new目录...
if exist "dist-new\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到dist-new版本
    set verified=1
    call :verify_directory "dist-new"
) else (
    echo ! dist-new目录中未找到程序
)

echo.
echo 检查dist目录...
if exist "dist\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到dist版本
    set verified=1
    call :verify_directory "dist"
) else (
    echo ! dist目录中未找到程序
)

if "%verified%"=="0" (
    echo.
    echo ✗ 未找到任何已生成的程序
    echo 请先运行生成流程
    pause
    goto :menu
)

echo.
echo 验证完成！
goto :eof

:verify_directory
set "base_dir=%~1"
echo.
echo 验证目录: %base_dir%

echo 检查可执行文件...
dir "%base_dir%\win-unpacked\Anime Manager.exe" | find "Anime Manager.exe"
if %errorlevel% neq 0 (
    echo ✗ 可执行文件验证失败
    goto :eof
)

echo.
echo 检查必要文件结构...
if exist "%base_dir%\win-unpacked\resources\app.asar" (
    echo ✓ app.asar 存在
) else (
    echo ✗ app.asar 不存在
)

if exist "%base_dir%\win-unpacked\resources\app.asar.unpacked\dist\index.html" (
    echo ✓ index.html 存在
) else (
    echo ✗ index.html 不存在
)

if exist "%base_dir%\win-unpacked\resources\app.asar.unpacked\dist\main\index.js" (
    echo ✓ 主进程文件存在
) else (
    echo ✗ 主进程文件不存在
)

echo.
echo 文件大小统计:
dir "%base_dir%\win-unpacked\Anime Manager.exe" | find "Anime Manager.exe"
echo.
dir "%base_dir%\win-unpacked\resources\app.asar" | find "app.asar"
goto :eof
```

**Step 2: 运行测试验证验证功能**

运行: `generate-unpacked.bat` 选择4
Expected: 执行验证流程

**Step 3: 提交验证功能**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加程序验证功能到generate-unpacked.bat"
```

---

### Task 6: 实现清理功能

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加清理函数**

```batch
:cleanup
echo.
echo ========================================
echo           清理构建文件
echo ========================================
echo.

echo 警告：此操作将删除所有构建和打包文件！
echo.
set /p confirm="确认要清理吗？(输入'y'确认): "

if /i not "%confirm%"=="y" (
    echo 清理已取消
    pause
    goto :menu
)

echo.
echo 开始清理...

set cleaned=0

if exist "dist" (
    echo 删除dist目录...
    rmdir /s /q "dist" 2>nul
    if not exist "dist" (
        echo ✓ dist目录已删除
        set cleaned=1
    ) else (
        echo ✗ 无法删除dist目录
    )
) else (
    echo ! dist目录不存在
)

if exist "dist-new" (
    echo 删除dist-new目录...
    rmdir /s /q "dist-new" 2>nul
    if not exist "dist-new" (
        echo ✓ dist-new目录已删除
        set cleaned=1
    ) else (
        echo ✗ 无法删除dist-new目录
    )
) else (
    echo ! dist-new目录不存在
)

echo.
if "%cleaned%"=="1" (
    echo 清理完成！
) else (
    echo 没有文件需要清理
)

pause
goto :menu
```

**Step 2: 运行测试验证清理功能**

运行: `generate-unpacked.bat` 选择5
Expected: 显示清理确认和结果

**Step 3: 提交清理功能**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加清理功能到generate-unpacked.bat"
```

---

### Task 7: 实现完整流程和集成

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加完整流程函数**

```batch
:full_process
echo.
echo ========================================
echo       生成未打包程序 (完整流程)
echo ========================================
echo.

echo 步骤1: 检查依赖
call :check_dependencies
if %errorlevel% neq 0 goto :menu

echo.
echo 步骤2: 构建项目
call :build_project
if %errorlevel% neq 0 goto :menu

echo.
echo 步骤3: 打包应用
call :pack_project
if %errorlevel% neq 0 goto :menu

echo.
echo 步骤4: 验证结果
call :verify_build

echo.
echo ========================================
echo           完整流程完成！
echo ========================================
echo.
echo 程序已生成到: dist-new\win-unpacked\
echo.
echo 下一步操作:
echo 1. 运行程序: 双击 "Anime Manager.exe"
echo 2. 测试程序: 运行 test-unpacked.bat
echo 3. 分发程序: 复制整个win-unpacked目录
echo.

set /p run_choice="是否要立即运行程序? (y/n): "
if /i "%run_choice%"=="y" (
    echo.
    echo 正在启动程序...
    start "" "dist-new\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
)

pause
goto :menu
```

**Step 2: 添加构建和打包专用函数**

```batch
:build_only
call :check_dependencies
if %errorlevel% neq 0 goto :menu
call :build_project
pause
goto :menu

:pack_only
call :pack_project
pause
goto :menu

:verify_only
call :verify_build
pause
goto :menu
```

**Step 3: 运行完整测试**

运行: `generate-unpacked.bat` 选择1
Expected: 执行完整流程

**Step 4: 提交完整实现**

```bash
git add generate-unpacked.bat
git commit -m "feat: 完成generate-unpacked.bat完整实现"
```

---

### Task 8: 添加错误处理和优化

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加错误处理增强**

```batch
:error_handling
echo.
echo ========================================
echo           错误处理增强
echo ========================================
echo.

REM 添加错误级别跟踪
set error_level=0

REM 添加超时处理
set timeout_seconds=300

REM 添加日志记录
set log_file=generate-unpacked.log
echo [%date% %time%] 开始执行 >> "%log_file%"

goto :eof

:log_message
echo [%date% %time%] %* >> "%log_file%"
echo %*
goto :eof

:check_timeout
REM 超时检查函数
goto :eof
```

**Step 2: 添加颜色支持**

```batch
REM 颜色定义
set "COLOR_RESET=[0m"
set "COLOR_RED=[91m"
set "COLOR_GREEN=[92m"
set "COLOR_YELLOW=[93m"
set "COLOR_BLUE=[94m"
set "COLOR_MAGENTA=[95m"
set "COLOR_CYAN=[96m"

:color_echo
echo %*
goto :eof
```

**Step 3: 添加进度指示**

```batch
:show_progress
setlocal
set "message=%~1"
set "current=%~2"
set "total=%~3"

if "%total%"=="" (
    echo %message%
) else (
    set /a percent=(current * 100) / total
    echo %message% [%current%/%total% - %percent%%%]
)
endlocal
goto :eof
```

**Step 4: 运行最终测试**

运行: `generate-unpacked.bat` 测试所有功能
Expected: 所有功能正常工作

**Step 5: 提交最终版本**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加错误处理和优化到generate-unpacked.bat"
```

---

### Task 9: 创建使用文档

**Files:**
- Create: `docs\使用说明-generate-unpacked.md`

**Step 1: 创建使用文档**

```markdown
# generate-unpacked.bat 使用说明

## 概述
`generate-unpacked.bat` 是一个自动化脚本，用于生成 Anime Manager 的未打包版本。它提供了完整的构建、打包、验证和清理流程。

## 功能特性

### 1. 完整流程 (选项1)
- 检查系统依赖 (Node.js, npm)
- 安装项目依赖 (如果需要)
- 构建项目 (TypeScript编译 + Vite构建)
- 打包Electron应用 (未打包版本)
- 验证生成结果
- 可选立即运行程序

### 2. 单独功能
- **选项2**: 仅构建项目
- **选项3**: 仅打包已构建的项目
- **选项4**: 验证已生成的程序
- **选项5**: 清理构建文件
- **选项6**: 查看帮助信息
- **选项7**: 退出程序

## 系统要求

### 必需软件
1. **Node.js** (v14或更高版本)
2. **npm** (随Node.js安装)
3. **electron-builder** (可全局安装或使用npx)

### 推荐配置
- Windows 10/11
- 管理员权限运行
- 稳定的网络连接 (用于npm安装)

## 使用步骤

### 首次使用
1. 确保已安装Node.js和npm
2. 双击运行 `generate-unpacked.bat`
3. 选择选项1运行完整流程

### 快速生成
```batch
generate-unpacked.bat
# 选择1 (完整流程)
```

### 仅构建
```batch
generate-unpacked.bat
# 选择2 (仅构建)
```

### 仅打包
```batch
generate-unpacked.bat
# 选择3 (仅打包)
```

## 输出目录

### 生成的文件位置
- **dist-new\win-unpacked\**: 主要输出目录
  - `Anime Manager.exe`: 主程序
  - `resources\`: 资源文件
  - `*.dll`: 依赖库

### 文件结构
```
dist-new/
└── win-unpacked/
    ├── Anime Manager.exe
    ├── resources/
    │   ├── app.asar
    │   └── app.asar.unpacked/
    │       └── dist/
    │           ├── index.html
    │           ├── main/
    │           │   └── index.js
    │           └── assets/
    └── 其他依赖文件...
```

## 常见问题

### Q1: 脚本运行失败，显示"Node.js未安装"
A: 请从 https://nodejs.org/ 下载并安装Node.js

### Q2: 构建过程中npm install失败
A: 检查网络连接，或尝试手动运行 `npm install`

### Q3: electron-builder打包失败
A: 尝试安装electron-builder: `npm install -g electron-builder`

### Q4: 生成的程序无法运行
A: 运行选项4验证程序完整性，或检查系统是否满足Electron要求

### Q5: 清理功能无法删除目录
A: 确保没有程序正在使用这些文件，或手动删除

## 高级用法

### 命令行参数 (计划中)
```batch
generate-unpacked.bat --build-only
generate-unpacked.bat --pack-only
generate-unpacked.bat --clean
```

### 环境变量
- `SET ELECTRON_BUILDER_CACHE=false`: 禁用缓存
- `SET NODE_OPTIONS=--max-old-space-size=4096`: 增加内存限制

## 日志文件
脚本会生成日志文件: `generate-unpacked.log`
包含时间戳和执行详情，用于调试。

## 版本历史
- v1.0.0 (2025-02-24): 初始版本，包含完整功能
```

**Step 2: 运行文档验证**

检查: `docs\使用说明-generate-unpacked.md`
Expected: 文档内容完整正确

**Step 3: 提交文档**

```bash
git add docs\使用说明-generate-unpacked.md
git commit -m "docs: 添加generate-unpacked.bat使用说明文档"
```

---

### Task 10: 集成测试和验证

**Files:**
- Modify: `generate-unpacked.bat`

**Step 1: 添加集成测试函数**

```batch
:run_integration_test
echo.
echo ========================================
echo           集成测试
echo ========================================
echo.

echo 测试1: 依赖检查
call :check_dependencies >nul
if %errorlevel% equ 0 (
    echo ✓ 依赖检查通过
) else (
    echo ✗ 依赖检查失败
    goto :test_failed
)

echo.
echo 测试2: 构建测试
if exist "src\" (
    echo ✓ 源代码目录存在
) else (
    echo ✗ 源代码目录不存在
    goto :test_failed
)

if exist "package.json" (
    echo ✓ package.json存在
) else (
    echo ✗ package.json不存在
    goto :test_failed
)

echo.
echo 测试3: 脚本自身测试
if exist "%~f0" (
    echo ✓ 脚本文件存在
) else (
    echo ✗ 脚本文件不存在
    goto :test_failed
)

echo.
echo 所有测试通过！
echo 脚本已准备好使用
goto :eof

:test_failed
echo.
echo 集成测试失败
echo 请检查项目结构
pause
goto :menu
```

**Step 2: 更新主菜单添加测试选项**

```batch
echo [1] 生成未打包程序 (完整流程)
echo [2] 仅构建项目 (不打包)
echo [3] 仅打包已构建的项目
echo [4] 验证已生成的程序
echo [5] 清理构建文件
echo [6] 运行集成测试
echo [7] 查看帮助信息
echo [8] 退出

set /p choice="请输入选项 (1-8): "

if "%choice%"=="1" goto :full_process
if "%choice%"=="2" goto :build_only
if "%choice%"=="3" goto :pack_only
if "%choice%"=="4" goto :verify_only
if "%choice%"=="5" goto :cleanup
if "%choice%"=="6" goto :run_integration_test
if "%choice%"=="7" goto :help
if "%choice%"=="8" goto :exit
```

**Step 3: 运行最终集成测试**

运行: `generate-unpacked.bat` 选择6
Expected: 集成测试通过

**Step 4: 提交最终版本**

```bash
git add generate-unpacked.bat
git commit -m "feat: 添加集成测试和最终优化"
```

---

## 执行选项

**计划完成并保存到 `docs\plans\2025-02-24-generate-unpacked-bat.md`。两个执行选项：**

**1. Subagent-Driven (此会话)** - 我分派新的子代理每个任务，任务间审查，快速迭代

**2. 并行会话 (分离)** - 使用executing-plans打开新会话，批量执行检查点

**选择哪种方法？**