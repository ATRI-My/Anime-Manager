@echo off
echo 正在启动动漫管理器（关闭问题修复版）...
echo.

REM 检查程序是否存在 - 优先使用关闭问题修复版
if exist "dist-unpacked-fixed\win-unpacked\Anime Manager.exe" (
    echo 使用关闭问题修复版本...
    start "" "dist-unpacked-fixed\win-unpacked\Anime Manager.exe"
) else if exist "dist-unpacked-v3\win-unpacked\Anime Manager.exe" (
    echo 使用焦点修复v3版本（简化架构版）...
    start "" "dist-unpacked-v3\win-unpacked\Anime Manager.exe"
) else if exist "dist-unpacked-v2\win-unpacked\Anime Manager.exe" (
    echo 使用焦点修复v2版本...
    start "" "dist-unpacked-v2\win-unpacked\Anime Manager.exe"
) else if exist "dist-unpacked\win-unpacked\Anime Manager.exe" (
    echo 使用原始版本...
    start "" "dist-unpacked\win-unpacked\Anime Manager.exe"
) else (
    echo 错误：未找到 Anime Manager.exe
    echo 请先运行打包命令生成程序
    pause
    exit /b 1
)

echo.
echo 程序已启动！
echo 模态框关闭功能已修复。
pause