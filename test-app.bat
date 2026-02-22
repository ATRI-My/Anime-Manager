@echo off
echo 启动应用...
cd "dist\win-unpacked"
"Anime Manager.exe" 2>&1
echo 应用退出，退出代码: %errorlevel%
pause