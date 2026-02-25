@echo off
echo 启动 Anime Manager 事件调试版本
echo.

if exist "dist-event-debug\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-event-debug\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集
    echo 4. 点击"添加新行"按钮
    echo 5. 尝试在输入框中：
    echo    - 点击输入框
    echo    - 尝试输入文字
    echo    - 按Tab键切换焦点
    echo 6. 查看日志中的事件信息
    echo.
    echo 调试信息包括：
    echo - 焦点获得/失去事件
    echo - 键盘按键事件
    echo - 点击事件详情
    echo - 事件是否被阻止
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause