@echo off
echo 启动 Anime Manager 焦点拦截器版本
echo.

if exist "dist-focus-blocker\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-focus-blocker\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集（观察是否有透明层覆盖）
    echo 4. 点击"添加新行"按钮
    echo 5. 检查输入框是否可以正常点击和输入
    echo.
    echo 解决方案原理：
    echo - 删除操作时添加透明层拦截所有点击
    echo - 防止列表更新后其他元素窃取焦点
    echo - 打开模态框前移除拦截器
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause