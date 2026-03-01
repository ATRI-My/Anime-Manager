@echo off
echo 启动动漫管理器...
echo.

REM 检查标准构建目录
if exist "dist\win-unpacked\Anime Manager.exe" (
    echo 找到未打包程序，正在启动...
    start "" "dist\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo 错误：未找到 Anime Manager.exe
    echo 请先运行打包命令生成程序：
    echo npm run build
    echo npm run pack
    pause
    exit /b 1
)