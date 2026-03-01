@echo off
echo 启动动漫管理工具...
echo.

REM 检查未打包程序是否存在
if exist "dist\win-unpacked\Anime Manager.exe" (
    echo 找到未打包程序，正在启动...
    start "" "dist\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo 错误：未找到可执行文件
    echo 请先运行 npm run pack 或 npm run dist
    pause
)