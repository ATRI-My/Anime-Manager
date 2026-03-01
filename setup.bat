@echo off
echo 动漫管理工具安装程序
echo =====================
echo.

REM 检查是否以管理员身份运行
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 请以管理员身份运行此安装程序！
    pause
    exit /b 1
)

REM 设置安装目录
set INSTALL_DIR=%ProgramFiles%\Anime Manager

echo 安装目录: %INSTALL_DIR%
echo.

REM 创建目录
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

REM 复制文件（实际上文件已经由7z解压）
echo 正在复制文件...
xcopy /E /Y "%~dp0win-unpacked\*" "%INSTALL_DIR%\" >nul

REM 创建开始菜单快捷方式
echo 创建开始菜单快捷方式...
set START_MENU=%ProgramData%\Microsoft\Windows\Start Menu\Programs\动漫管理工具
if not exist "%START_MENU%" mkdir "%START_MENU%"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\create_shortcut.vbs"
echo sLinkFile = "%START_MENU%\动漫管理工具.lnk" >> "%TEMP%\create_shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\create_shortcut.vbs"
echo oLink.TargetPath = "%INSTALL_DIR%\Anime Manager.exe" >> "%TEMP%\create_shortcut.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\create_shortcut.vbs"
echo oLink.Save >> "%TEMP%\create_shortcut.vbs"
cscript //nologo "%TEMP%\create_shortcut.vbs"
del "%TEMP%\create_shortcut.vbs"

REM 创建桌面快捷方式
echo 创建桌面快捷方式...
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\create_desktop.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\动漫管理工具.lnk" >> "%TEMP%\create_desktop.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\create_desktop.vbs"
echo oLink.TargetPath = "%INSTALL_DIR%\Anime Manager.exe" >> "%TEMP%\create_desktop.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\create_desktop.vbs"
echo oLink.Save >> "%TEMP%\create_desktop.vbs"
cscript //nologo "%TEMP%\create_desktop.vbs"
del "%TEMP%\create_desktop.vbs"

REM 创建卸载脚本
echo 创建卸载程序...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo 正在卸载动漫管理工具... >> "%INSTALL_DIR%\uninstall.bat"
echo echo. >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo del "%USERPROFILE%\Desktop\动漫管理工具.lnk" >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%START_MENU%" >> "%INSTALL_DIR%\uninstall.bat"
echo echo 卸载完成！ >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

echo.
echo 安装完成！
echo.
echo 安装目录: %INSTALL_DIR%
echo 开始菜单: 动漫管理工具
echo 桌面快捷方式: 已创建
echo.
echo 按任意键启动程序...
pause >nul

REM 启动程序
start "" "%INSTALL_DIR%\Anime Manager.exe"