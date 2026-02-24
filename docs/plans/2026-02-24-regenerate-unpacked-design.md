# 重新生成未打包程序设计文档

## 概述
重新生成动漫管理器的未打包程序版本，包含最新的焦点问题修复，输出到默认目录 `dist-unpacked`。

## 需求分析
- **目标**：生成包含最新代码的未打包程序
- **输出目录**：`dist-unpacked`（默认目录）
- **包含修复**：最新的焦点问题修复
- **验证要求**：生成后可执行文件应能正常运行

## 技术方案

### 方案选择：修改现有脚本
基于现有 `pack-temp.bat` 脚本进行修改，创建专用的未打包程序生成脚本。

### 构建流程
1. **预处理**
   - 停止正在运行的Electron进程
   - 清理旧的 `dist-unpacked` 目录
   - 确保依赖已安装

2. **构建项目**
   - 编译TypeScript代码
   - 构建前端资源
   - 验证构建结果

3. **生成未打包程序**
   - 使用 `electron-builder --dir` 生成未打包版本
   - 指定输出目录为 `dist-unpacked`
   - 包含所有依赖和资源

4. **后处理**
   - 验证可执行文件
   - 更新文档
   - 清理临时文件

## 脚本设计

### 脚本名称：`generate-unpacked.bat`
```batch
@echo off
echo 生成未打包程序 (dist-unpacked)
echo.

REM 1. 停止Electron进程
echo 停止正在运行的Electron进程...
taskkill /F /IM electron.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM 2. 清理旧的构建目录
echo 清理旧的构建目录...
if exist "dist-unpacked" rmdir /S /Q "dist-unpacked" >nul 2>&1
if exist "dist" rmdir /S /Q "dist" >nul 2>&1

REM 3. 构建项目
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

REM 4. 生成未打包程序
echo 生成未打包程序...
npx electron-builder --dir --config.directories.output=dist-unpacked
if %errorlevel% neq 0 (
    echo 打包失败！
    pause
    exit /b 1
)

REM 5. 验证结果
if exist "dist-unpacked\win-unpacked\Anime Manager.exe" (
    echo ✓ 未打包程序生成成功！
    echo 可执行文件: dist-unpacked\win-unpacked\Anime Manager.exe
    echo.
    echo 包含的修复：
    echo - 剧集管理输入框焦点问题修复
    echo - 简化焦点管理逻辑
    echo - 删除操作后焦点清除
) else (
    echo ✗ 生成失败，可执行文件不存在
    pause
    exit /b 1
)

echo.
echo 完成！未打包程序已生成到 dist-unpacked 目录。
pause
```

## 文件结构
```
dist-unpacked/
└── win-unpacked/
    ├── Anime Manager.exe          # 主程序
    ├── resources/                 # 资源文件
    │   ├── app.asar               # 打包的应用代码
    │   └── app.asar.unpacked/     # 解压的代码
    └── 其他依赖文件...
```

## 验证步骤
1. 运行生成的 `Anime Manager.exe`
2. 测试焦点问题修复：
   - 添加剧集 → 删除剧集 → 再次添加新剧集
   - 批量删除剧集 → 添加新剧集
3. 验证其他核心功能正常

## 风险与缓解
- **风险1**：构建过程中依赖问题
  - **缓解**：使用 `npm ci` 确保依赖一致性
- **风险2**：输出目录权限问题
  - **缓解**：脚本包含目录清理和创建
- **风险3**：生成的程序无法启动
  - **缓解**：包含验证步骤，检查可执行文件

## 时间估计
- 脚本开发：15分钟
- 测试验证：10分钟
- 文档更新：5分钟
- **总计**：约30分钟

## 下一步
1. 创建生成脚本
2. 测试脚本功能
3. 验证生成的程序
4. 更新相关文档

---
**设计批准**：等待用户确认