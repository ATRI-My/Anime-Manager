@echo off
echo 启动 Anime Manager 简化模态框版本
echo.

if exist "dist-simple-modal\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到可执行文件
    echo 正在启动程序...
    start "" "dist-simple-modal\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
    echo.
    echo 测试步骤：
    echo 1. 进入写入板块
    echo 2. 选择一个动漫
    echo 3. 点击"添加新行"按钮
    echo 4. 观察模态框：
    echo    - 是否有灰色背景
    echo    - 是否有白色模态框内容
    echo    - 是否有输入框和按钮
    echo    - 是否只有一个关闭按钮（叉）
    echo 5. 测试输入框是否可以输入
) else (
    echo ✗ 错误：可执行文件不存在
)

echo.
pause