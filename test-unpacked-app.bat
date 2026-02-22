@echo off
echo 测试未打包的Anime Manager应用程序...
echo.

echo 检查应用程序文件...
if exist "dist\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到主程序文件: Anime Manager.exe
) else (
    echo ✗ 未找到主程序文件
    exit /b 1
)

echo.
echo 检查资源文件...
if exist "dist\win-unpacked\resources\app.asar" (
    echo ✓ 找到应用资源文件: app.asar
) else (
    echo ✗ 未找到应用资源文件
    exit /b 1
)

echo.
echo 检查构建文件...
if exist "dist\win-unpacked\resources\app.asar.unpacked\dist\index.html" (
    echo ✓ 找到前端入口文件: index.html
) else (
    echo ✗ 未找到前端入口文件
    exit /b 1
)

if exist "dist\win-unpacked\resources\app.asar.unpacked\dist\main\index.js" (
    echo ✓ 找到主进程文件: main/index.js
) else (
    echo ✗ 未找到主进程文件
    exit /b 1
)

echo.
echo 应用程序结构验证完成！
echo.
echo 要运行应用程序，请执行以下操作：
echo 1. 打开资源管理器
echo 2. 导航到: %CD%\dist\win-unpacked
echo 3. 双击 "Anime Manager.exe"
echo.
echo 或者直接运行:
echo start "" "dist\win-unpacked\Anime Manager.exe"
echo.
pause