@echo off
echo 启动 Anime Manager 清理版本
echo.

if exist "dist-clean\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-clean\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause