@echo off
echo 启动 Anime Manager 激进重绘版本
echo.

if exist "dist-aggressive\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-aggressive\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 删除一个剧集
    echo 4. 等待300ms后点击"添加新行"按钮
    echo 5. 观察日志中的重绘信息
    echo.
    echo 解决方案特点：
    echo - 删除后等待300ms再打开模态框
    echo - 强制全页面重绘（修改body样式）
    echo - 强制所有输入框重绘
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause