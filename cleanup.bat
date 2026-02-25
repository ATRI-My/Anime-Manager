@echo off
echo 正在清理dist目录...
timeout /t 2 /nobreak >nul

echo 停止可能运行的进程...
taskkill /F /IM "Anime Manager.exe" 2>nul
taskkill /F /IM "electron.exe" 2>nul
taskkill /F /IM "node.exe" 2>nul

echo 等待进程停止...
timeout /t 3 /nobreak >nul

echo 删除dist目录...
if exist dist (
    rmdir /s /q dist 2>nul
    if exist dist (
        echo 警告: 无法完全删除dist目录，某些文件可能被占用
    ) else (
        echo dist目录已成功删除
    )
)

echo 清理完成
pause