@echo off
echo 启动 Anime Manager 点击调试版本
echo.

if exist "dist-click-debug\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-click-debug\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 点击"添加新行"按钮
    echo 4. 在模态框中：
    echo    - 点击输入框（观察日志）
    echo    - 点击模态框其他区域（观察日志）
    echo    - 点击背景遮罩（会关闭模态框）
    echo 5. 查看日志中的点击事件信息
    echo.
    echo 调试信息包括：
    echo - 输入框点击事件详情
    echo - 输入框状态检查
    echo - 背景遮罩点击事件
    echo - 模态框内容点击事件
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause