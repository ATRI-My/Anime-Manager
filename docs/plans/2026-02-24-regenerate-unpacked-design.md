# 重新生成未打包程序 - 设计文档

## 项目背景
动漫资源管理器桌面应用（Electron + React + TypeScript），需要重新生成未打包程序以包含最新的bug修复。

## 需求分析
- **原因**：修复了新的bug，需要重新构建包含修复
- **目标**：生成干净的未打包程序（dist-unpacked）
- **约束**：使用现有构建脚本，确保包含所有修复

## 设计方案

### 1. 构建方法
**使用现有脚本**：`generate-unpacked.bat`
- 自动停止正在运行的Electron进程
- 清理旧的构建目录（dist和dist-unpacked）
- 执行完整构建：`npm run build`
- 生成未打包程序：`electron-builder --dir`

### 2. 构建流程
1. **停止进程**：停止正在运行的Electron进程
2. **清理目录**：删除dist和dist-unpacked目录
3. **构建项目**：执行npm run build（TypeScript编译 + React构建）
4. **打包程序**：使用electron-builder生成未打包版本
5. **验证结果**：检查可执行文件是否存在

### 3. 输出结构
```
dist-unpacked/
└── win-unpacked/
    ├── Anime Manager.exe
    ├── resources/
    │   ├── app.asar
    │   └── app.asar.unpacked/
    └── 其他依赖文件...
```

### 4. 包含内容
- 最新的代码修复
- 完整的TypeScript编译
- React应用构建
- Electron打包配置
- 焦点问题修复（已包含在代码中）

### 5. 验证标准
- 可执行文件存在：`dist-unpacked\win-unpacked\Anime Manager.exe`
- 构建时间戳为当前时间
- 脚本执行无错误

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

## 实施计划
1. 执行generate-unpacked.bat脚本
2. 监控构建过程
3. 验证生成结果
4. 如有问题，进行调试

## 风险与缓解
- **风险**：构建过程中可能出现依赖问题
- **缓解**：脚本包含错误处理，可以手动检查
- **风险**：旧的构建文件可能影响新构建
- **缓解**：脚本自动清理旧目录

## 批准记录
- 设计方案已获用户批准
- 实施方法：使用现有脚本generate-unpacked.bat
- 批准时间：2026年2月24日