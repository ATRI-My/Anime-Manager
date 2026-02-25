@echo off
echo 启动 Anime Manager 核弹解决方案版本
echo.

if exist "dist-nuclear\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-nuclear\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集
    echo 4. 点击"添加新行"按钮
    echo 5. 观察模态框是否会先关闭再重新打开
    echo 6. 检查输入框是否可以正常输入
    echo.
    echo 解决方案原理：
    echo 模拟"最小化再恢复窗口"的效果，强制模态框完全重新渲染
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause