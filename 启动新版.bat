@echo off
echo 启动新版 Anime Manager (WritePage重构版)
echo.

echo 检查未打包程序...
if not exist "dist-temp\win-unpacked\Anime Manager.exe" (
    echo 错误: 未找到可执行文件
    echo 请先运行打包脚本: npm run build && npm run pack
    pause
    exit /b 1
)

echo 启动 Anime Manager...
start "" "dist-temp\win-unpacked\Anime Manager.exe"

echo 程序已启动！
echo 注意: 这是WritePage重构后的新版本
echo 主要改进:
echo 1. 状态管理重构 - 解决添加新行bug
echo 2. 移除所有hack代码
echo 3. 添加错误处理和优化
echo.
pause