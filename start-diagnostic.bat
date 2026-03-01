@echo off
echo 正在启动动漫管理器（诊断版）...
echo.
echo 此版本包含详细的事件日志，用于诊断输入框焦点问题。
echo 请按F12打开开发者工具查看控制台日志。
echo.

if exist "dist-unpacked-diagnostic\win-unpacked\Anime Manager.exe" (
    echo 启动诊断版本...
    start "" "dist-unpacked-diagnostic\win-unpacked\Anime Manager.exe"
) else (
    echo 错误：未找到诊断版本程序
    echo 请先运行打包命令生成程序
    pause
    exit /b 1
)

echo.
echo 程序已启动！
echo.
echo === 测试步骤 ===
echo 1. 按F12打开开发者工具
echo 2. 切换到Console（控制台）标签页
echo 3. 进入"写入"板块
echo 4. 选择一个番剧
echo 5. 点击"添加新行"按钮
echo 6. 尝试点击输入框
echo 7. 观察控制台日志
echo.
echo 请将控制台日志截图或复制保存为文本文件。
pause