@echo off
echo 启动 Anime Manager 无动画版本
echo.

if exist "dist-no-animation\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-no-animation\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集
    echo 4. 点击"添加新行"按钮
    echo 5. 观察：
    echo    - 模态框是否立即显示（无动画）
    echo    - 输入框是否可以点击和输入
    echo    - 查看日志中的焦点检查结果
    echo.
    echo 版本特点：
    echo - 移除所有CSS过渡动画
    echo - 增强的焦点调试信息
    echo - 立即和延迟焦点检查
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause