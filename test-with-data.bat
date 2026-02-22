@echo off
chcp 65001 >nul
echo Testing Anime Manager with sample data
echo ======================================
echo.

echo 1. Checking if data file exists
if exist "%APPDATA%\anime-manager\anime-data.json" (
    echo Data file found: %APPDATA%\anime-manager\anime-data.json
    echo File size: 
    for %%F in ("%APPDATA%\anime-manager\anime-data.json") do echo   %%~zF bytes
) else (
    echo ERROR: Data file not found!
    echo Please run setup-test-data.bat first
    pause
    exit /b 1
)

echo.
echo 2. Starting Anime Manager...
echo The application should now load 5 anime from the data file.
echo.
echo 3. Expected anime in the application:
echo   - Jujutsu Kaisen Season 2
echo   - Frieren: Beyond Journey's End
echo   - Spy x Family
echo   - Demon Slayer: Entertainment District Arc
echo   - Bocchi the Rock!
echo.

echo 4. Launching application...
cd /d "dist\win-unpacked"
start "" "Anime Manager.exe"

echo.
echo Application launched. Check if you can see the anime list.
echo If the window is blank, press F12 to open Developer Tools
echo and check the Console tab for errors.
echo.
pause