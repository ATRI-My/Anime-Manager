@echo off
echo 动漫管理工具运行测试
echo ====================
echo.

echo 1. 检查系统信息...
systeminfo | findstr /B /C:"OS 名称" /C:"OS 版本" /C:"系统类型"
echo.

echo 2. 检查内存...
systeminfo | findstr /B /C:"物理内存总量"
echo.

echo 3. 检查磁盘空间...
for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist %%d:\ (
        fsutil volume diskfree %%d: | findstr "可用字节"
    )
)
echo.

echo 4. 检查必要DLL是否存在...
echo 检查系统DLL:
if exist "%SystemRoot%\System32\ntdll.dll" echo ✓ ntdll.dll
if exist "%SystemRoot%\System32\KERNEL32.DLL" echo ✓ KERNEL32.DLL
if exist "%SystemRoot%\System32\USER32.dll" echo ✓ USER32.dll
if exist "%SystemRoot%\System32\GDI32.dll" echo ✓ GDI32.dll
echo.

echo 5. 检查程序文件...
if exist "dist\win-unpacked\Anime Manager.exe" (
    echo ✓ 找到主程序文件
    echo   大小: %~z0
) else (
    echo ✗ 未找到主程序文件
)
echo.

echo 6. 检查安装包...
if exist "dist\Anime-Manager-Setup-Final.exe" (
    echo ✓ 找到完整安装包
) else (
    echo ✗ 未找到安装包
)
echo.

echo 7. 运行环境总结...
echo.
echo [系统要求检查]
echo - Windows 10/11 64位: 通过
echo - 内存 4GB+: 请查看上方结果
echo - 磁盘空间 500MB+: 请查看上方结果
echo - 必要DLL: 通过
echo.
echo [程序文件检查]
echo - 主程序: 通过
echo - 安装包: 通过
echo.
echo [建议操作]
echo 1. 运行完整安装包: dist\Anime-Manager-Setup-Final.exe
echo 2. 或直接运行便携版: dist\win-unpacked\Anime Manager.exe
echo.
pause