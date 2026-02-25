@echo off
echo 启动 Anime Manager 测试按钮版本
echo.

if exist "dist-test-buttons\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-test-buttons\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 请检查：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 点击"添加新行"按钮
    echo 4. 查看模态框中是否有"取消"按钮
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause