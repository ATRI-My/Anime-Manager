@echo off
echo 生成未打包程序 (dist-unpacked)
echo.
echo 包含最新的焦点问题修复
echo.

REM 设置错误处理
setlocal enabledelayedexpansion

REM 1. 停止Electron进程
echo 停止正在运行的Electron进程...
taskkill /F /IM electron.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM 2. 清理旧的构建目录
echo 清理旧的构建目录...
if exist "dist-unpacked" rmdir /S /Q "dist-unpacked" >nul 2>&1
if exist "dist" rmdir /S /Q "dist" >nul 2>&1

REM 3. 构建项目
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

REM 4. 生成未打包程序
echo 生成未打包程序...
npx electron-builder --dir --config.directories.output=dist-unpacked
if %errorlevel% neq 0 (
    echo 打包失败！
    pause
    exit /b 1
)

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
echo 构建完成时间: %date% %time%
pause