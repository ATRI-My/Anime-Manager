@echo off
echo 启动 Anime Manager 焦点调试版本
echo.

if exist "dist-focus-debug\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-focus-debug\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集
    echo 4. 点击"添加新行"按钮
    echo 5. 观察日志文件中的调试信息
    echo 6. 如果输入框无法输入，尝试点击"修复输入框"按钮（黄色小按钮）
    echo.
    echo 日志文件位置：
    echo C:\Users\%USERNAME%\AppData\Roaming\anime-manager\logs\app-*.log
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause