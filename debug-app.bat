@echo off
chcp 65001 >nul
echo Debugging Anime Manager
echo =======================
echo.

echo 1. Checking data file
if exist "%APPDATA%\Anime Manager\anime-data.json" (
    echo Data file exists: %APPDATA%\Anime Manager\anime-data.json
    echo File content preview:
    type "%APPDATA%\Anime Manager\anime-data.json" | head -5
) else (
    echo ERROR: Data file not found!
    exit /b 1
)

echo.
echo 2. Starting application with debug output...
echo    Note: Open Developer Tools (F12) to see console logs
echo.

cd /d "dist\win-unpacked"
start "" "Anime Manager.exe"

echo.
echo 3. Application started. Please check:
echo    - Is the window showing anime list?
echo    - Press F12 to open Developer Tools
echo    - Check Console tab for logs
echo    - Look for "初始化加载动漫数据..." message
echo.
pause