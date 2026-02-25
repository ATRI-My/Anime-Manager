@echo off
echo 启动 Anime Manager 最终修复版本
echo.

if exist "dist-final\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 文件路径: %cd%\dist-final\win-unpacked\Anime Manager.exe
    echo.
    echo 正在启动程序...
    start "" "dist-final\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 测试批量删除（选中多个剧集，点击删除）
    echo 4. 测试添加新行（删除后点击添加新行按钮）
    echo.
    echo 日志文件位置：
    echo C:\Users\%USERNAME%\AppData\Roaming\anime-manager\logs\app-*.log
) else (
    echo ✗ 错误：可执行文件不存在
    echo 请先运行: npm run build && npx electron-builder --dir --config.directories.output=dist-final
)

echo.
pause