@echo off
echo 启动 Anime Manager 修复版本
echo.

if exist "dist-new2\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-new2\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo ✗ 错误：可执行文件不存在
    echo 请先运行: npm run build && npx electron-builder --dir --config.directories.output=dist-new2
)

echo.
pause