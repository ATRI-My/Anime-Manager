@echo off
echo 测试 Anime Manager 未打包版本...
echo.

echo 检查可执行文件...
if exist "dist-unpacked\win-unpacked\Anime Manager.exe" (
    echo ✓ 可执行文件存在
    echo 文件大小: 
    dir "dist-unpacked\win-unpacked\Anime Manager.exe" | find "Anime Manager.exe"
) else (
    echo ✗ 可执行文件不存在
    goto :error
)

echo.
echo 检查必要文件...
if exist "dist-unpacked\win-unpacked\resources\app.asar" (
    echo ✓ app.asar 存在
) else (
    echo ✗ app.asar 不存在
)

if exist "dist-unpacked\win-unpacked\resources\app.asar.unpacked\dist\index.html" (
    echo ✓ index.html 存在
) else (
    echo ✗ index.html 不存在
)

echo.
echo 程序结构验证完成！
echo.
echo 要运行程序，请执行:
echo 1. 进入目录: dist-unpacked\win-unpacked\
echo 2. 双击运行: "Anime Manager.exe"
echo.
echo 或者直接运行:
echo start "" "dist-unpacked\win-unpacked\Anime Manager.exe"
echo.

:run
set /p choice="是否要运行程序? (y/n): "
if /i "%choice%"=="y" (
    echo 正在启动 Anime Manager...
    start "" "dist-unpacked\win-unpacked\Anime Manager.exe"
    echo 程序已启动！
) else (
    echo 取消运行。
)

goto :end

:error
echo 程序验证失败！
pause
exit /b 1

:end
echo.
echo 测试完成！
pause