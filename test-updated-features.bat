@echo off
chcp 65001 >nul
echo ============================================
echo 动漫管理器 - 剧集编辑保存功能改进测试
echo ============================================
echo.
echo 更新内容：
echo 1. 添加了未保存修改提示横幅
echo 2. 增强了文件状态显示
echo 3. 添加了操作后Toast提示
echo 4. 添加了页面切换和应用关闭保护
echo.
echo 测试步骤：
echo 1. 运行 "dist\win-unpacked\Anime Manager.exe"
echo 2. 点击顶部导航栏的"写入"标签
echo 3. 选择一个番剧（如"咒术回战 第二季"）
echo 4. 编辑一个剧集或添加新剧集
echo 5. 观察以下变化：
echo    - 页面顶部出现黄色横幅提示
echo    - 状态栏显示"有未保存的修改"
echo    - 保存按钮变为蓝色高亮
echo    - 显示Toast提示："修改已保存到内存"
echo 6. 点击"立即保存"按钮或文件操作栏的"保存"按钮
echo 7. 观察状态恢复："文件已保存"
echo.
echo 注意事项：
echo - 未打包版本无需安装，直接运行exe文件
echo - 数据保存在：%%APPDATA%%\anime-manager\anime-data.json
echo - 关闭应用时如有未保存修改会提示确认
echo.
pause