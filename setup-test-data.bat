@echo off
chcp 65001 >nul
echo Setting up test data file
echo =========================
echo.

echo 1. Finding Electron user data directory
echo.
echo On Windows, Anime Manager user data directory is:
echo %%APPDATA%%\anime-manager
echo (Based on package.json name field: anime-manager)
echo.
echo Example full path:
echo C:\Users\%USERNAME%\AppData\Roaming\anime-manager
echo.

echo 2. Checking if directory exists
if exist "%APPDATA%\anime-manager" (
    echo Directory found: %APPDATA%\anime-manager
) else (
    echo Directory does not exist, creating it...
    mkdir "%APPDATA%\anime-manager" 2>nul
)

echo.
echo 3. Copying example data file to user data directory
echo Copying example-anime-data.json to user data directory...
xcopy /Y "example-anime-data.json" "%APPDATA%\anime-manager\anime-data.json" >nul 2>&1

if errorlevel 1 (
    echo Copy failed, directory may not exist
    echo.
    echo Please create directory and copy file manually:
    echo mkdir "%APPDATA%\anime-manager"
    echo copy "example-anime-data.json" "%APPDATA%\anime-manager\anime-data.json"
) else (
    echo Copy successful!
    echo File saved to: %APPDATA%\anime-manager\anime-data.json
)

echo.
echo 4. File contents
echo Example file contains 5 anime:
echo   - Jujutsu Kaisen Season 2 (3 episodes)
echo   - Frieren: Beyond Journey's End (4 episodes) 
echo   - Spy x Family (3 episodes)
echo   - Demon Slayer: Entertainment District Arc (5 episodes)
echo   - Bocchi the Rock! (3 episodes)
echo.
echo 5. Testing the application
echo Now run Anime Manager.exe, you should see these anime data
echo.
pause