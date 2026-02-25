@echo off
echo 启动 Anime Manager 重新渲染版本
echo.

if exist "dist-rerender\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-rerender\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集（单个删除或批量删除）
    echo 4. 点击"添加新行"按钮
    echo 5. 检查输入框是否可以正常输入
    echo.
    echo 注意：删除操作后会强制重新渲染整个写入模块
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause