@echo off
echo 临时打包脚本 - 使用不同的输出目录
echo.

echo 1. 停止所有Electron进程...
taskkill /F /IM electron.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2. 删除旧的打包目录...
if exist "dist-temp" rmdir /S /Q "dist-temp" >nul 2>&1

echo 3. 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo 4. 临时修改package.json使用不同的输出目录...
copy package.json package.json.backup >nul
powershell -Command "(Get-Content package.json) -replace '\"output\": \"dist\"', '\"output\": \"dist-temp\"' | Set-Content package.json"

echo 5. 打包到临时目录...
call npm run pack
if %errorlevel% neq 0 (
    echo 打包失败！
    copy package.json.backup package.json >nul
    pause
    exit /b 1
)

echo 6. 恢复原始package.json...
copy package.json.backup package.json >nul
del package.json.backup >nul

echo 7. 验证打包结果...
if exist "dist-temp\win-unpacked\Anime Manager.exe" (
    echo ✓ 打包成功！
    echo 可执行文件: dist-temp\win-unpacked\Anime Manager.exe
    echo.
    set /p choice="是否要运行程序? (y/n): "
    if /i "%choice%"=="y" (
        echo 正在启动 Anime Manager...
        start "" "dist-temp\win-unpacked\Anime Manager.exe"
    )
) else (
    echo ✗ 打包失败，可执行文件不存在
)

echo.
echo 完成！
pause