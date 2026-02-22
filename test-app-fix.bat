@echo off
echo 测试修复后的Anime Manager程序...
echo.

cd /d "dist\win-unpacked"
echo 正在启动程序...
start "" "Anime Manager.exe"

echo.
echo 程序已启动。请检查窗口是否正常显示内容。
echo 如果窗口显示空白，请按Ctrl+C停止此脚本。
echo.
pause