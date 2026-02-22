# 打包配置实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 配置electron-builder，生成Windows可执行文件，测试安装流程

**架构:** 更新package.json中的build配置，优化npm脚本，生成NSIS安装程序和便携版exe，进行三级测试验证

**技术栈:** Electron 25, electron-builder 24, Windows平台

---

### Task 1: 更新electron-builder配置

**文件:**
- 修改: `package.json:13-25`

**步骤1: 更新build配置**

```json
{
  "build": {
    "appId": "com.anime.manager",
    "productName": "Anime Manager",
    "directories": {
      "output": "dist"
    },
    "files": ["dist/**/*"],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

**步骤2: 验证配置语法**

运行: `node -c package.json`
预期: 无错误输出

**步骤3: 提交更改**

```bash
git add package.json
git commit -m "feat: update electron-builder configuration"
```

### Task 2: 优化npm脚本

**文件:**
- 修改: `package.json:6-12`

**步骤1: 添加构建验证脚本**

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"electron .\"",
    "build": "npx tsc -p tsconfig.main.json && vite build",
    "preview": "vite preview",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "verify-build": "npm run build && echo 'Build verification passed'",
    "dist:win": "npm run verify-build && electron-builder --win"
  }
}
```

**步骤2: 验证脚本语法**

运行: `node -c package.json`
预期: 无错误输出

**步骤3: 提交更改**

```bash
git add package.json
git commit -m "feat: add build verification scripts"
```

### Task 3: 验证项目构建

**文件:**
- 检查: `dist/` 目录

**步骤1: 运行构建验证**

运行: `npm run verify-build`
预期: 输出 "Build verification passed"，dist目录包含构建文件

**步骤2: 检查构建输出**

运行: `ls -la dist/`
预期: 包含main和renderer子目录

**步骤3: 提交构建状态**

```bash
git add dist/
git commit -m "build: verify project builds successfully"
```

### Task 4: 生成未打包应用

**文件:**
- 创建: `dist/win-unpacked/` 目录

**步骤1: 运行pack命令**

运行: `npm run pack`
预期: 生成未打包的应用目录，输出类似 "Packaging app for platform win32 x64 using electron v25.0.0"

**步骤2: 验证pack输出**

运行: `ls -la dist/win-unpacked/`
预期: 包含Anime Manager.exe和其他依赖文件

**步骤3: 测试未打包应用**

运行: `"./dist/win-unpacked/Anime Manager.exe"`
预期: 应用正常启动（手动验证）

**步骤4: 提交pack结果**

```bash
git add dist/win-unpacked/
git commit -m "build: generate unpacked application"
```

### Task 5: 生成NSIS安装程序

**文件:**
- 创建: `dist/` 目录下的安装程序

**步骤1: 运行dist命令**

运行: `npm run dist`
预期: 生成安装程序，输出类似 "Building NSIS installer"

**步骤2: 验证安装程序文件**

运行: `ls -la dist/*.exe`
预期: 包含类似 "Anime Manager Setup 1.0.0.exe" 的文件

**步骤3: 检查文件大小**

运行: `du -h dist/*.exe`
预期: 安装程序文件大小合理（几十到几百MB）

**步骤4: 提交安装程序**

```bash
git add dist/*.exe
git commit -m "build: generate NSIS installer"
```

### Task 6: 生成便携版exe

**文件:**
- 创建: `dist/` 目录下的便携版

**步骤1: 验证便携版生成**

运行: `ls -la dist/*portable*.exe`
预期: 包含类似 "Anime Manager-1.0.0-portable.exe" 的文件

**步骤2: 检查便携版文件**

运行: `file dist/*portable*.exe`
预期: 识别为PE32+可执行文件

**步骤3: 提交便携版**

```bash
git add dist/*portable*.exe
git commit -m "build: generate portable executable"
```

### Task 7: 基本安装测试

**文件:**
- 测试: NSIS安装程序

**步骤1: 运行安装程序测试**

运行: `"./dist/Anime Manager Setup 1.0.0.exe" /S`
预期: 静默安装成功（需要管理员权限）

**步骤2: 验证安装路径**

运行: `ls -la "C:/Program Files/Anime Manager/"`
预期: 包含应用文件

**步骤3: 验证桌面快捷方式**

检查: 桌面是否有 "Anime Manager" 快捷方式

**步骤4: 记录测试结果**

创建文件: `docs/tests/installation-test-1.md`
内容: 安装测试结果记录

### Task 8: 功能测试

**文件:**
- 测试: 安装后的应用功能

**步骤1: 启动安装的应用**

运行: `"C:/Program Files/Anime Manager/Anime Manager.exe"`
预期: 应用正常启动

**步骤2: 测试查询板块功能**

手动测试: 搜索功能、番剧展示、集数管理

**步骤3: 测试写入板块功能**

手动测试: 文件操作、番剧编辑、剧集编辑

**步骤4: 测试设置板块功能**

手动测试: 工具配置、路径设置

**步骤5: 记录功能测试结果**

更新文件: `docs/tests/installation-test-1.md`
添加: 功能测试结果

### Task 9: 卸载测试

**文件:**
- 测试: 卸载程序

**步骤1: 运行卸载程序**

运行: `"C:/Program Files/Anime Manager/unins000.exe" /S`
预期: 静默卸载成功

**步骤2: 验证文件清理**

运行: `ls -la "C:/Program Files/" | grep -i anime`
预期: 无Anime Manager相关文件

**步骤3: 验证注册表清理**

运行: `reg query "HKCU\Software\Anime Manager" 2>nul`
预期: 命令失败（键不存在）

**步骤4: 记录卸载测试结果**

更新文件: `docs/tests/installation-test-1.md`
添加: 卸载测试结果

### Task 10: 便携版测试

**文件:**
- 测试: 便携版exe

**步骤1: 运行便携版**

运行: `"./dist/Anime Manager-1.0.0-portable.exe"`
预期: 应用正常启动

**步骤2: 测试便携版功能**

手动测试: 所有三大板块功能

**步骤3: 验证无安装痕迹**

检查: 程序文件和用户数据目录
预期: 仅在运行目录创建临时文件

**步骤4: 记录便携版测试结果**

创建文件: `docs/tests/portable-test-1.md`
内容: 便携版测试结果

### Task 11: 打包总结报告

**文件:**
- 创建: `docs/packaging-summary.md`

**步骤1: 生成打包统计**

运行: `du -h dist/*.exe`
记录: 文件大小信息

**步骤2: 生成测试总结**

汇总: `docs/tests/` 目录下的测试结果

**步骤3: 创建总结文档**

```markdown
# 打包配置总结报告

## 生成文件
- NSIS安装程序: Anime Manager Setup 1.0.0.exe (XX MB)
- 便携版: Anime Manager-1.0.0-portable.exe (XX MB)

## 测试结果
- 安装测试: ✅ 通过
- 功能测试: ✅ 通过  
- 卸载测试: ✅ 通过
- 便携版测试: ✅ 通过

## 配置详情
- electron-builder版本: 24.0.0
- 目标平台: Windows x64
- 打包时间: YYYY-MM-DD HH:MM
```

**步骤4: 提交最终结果**

```bash
git add docs/
git commit -m "docs: add packaging test summary"
```

### Task 12: 清理和优化

**文件:**
- 清理: 临时文件

**步骤1: 清理构建缓存**

运行: `rm -rf dist/win-unpacked/`
运行: `rm -rf node_modules/.cache/`

**步骤2: 更新.gitignore**

检查: `.gitignore` 是否包含构建输出
添加: `dist/win-unpacked/` 到.gitignore

**步骤3: 最终验证**

运行: `npm run verify-build`
预期: 构建仍然成功

**步骤4: 提交最终状态**

```bash
git add .gitignore
git commit -m "chore: clean up build artifacts"
```