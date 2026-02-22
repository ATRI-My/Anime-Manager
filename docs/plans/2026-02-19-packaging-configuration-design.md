# 打包配置设计文档

**日期**: 2026-02-19  
**项目**: Anime Manager 动漫资源管理器  
**任务**: Task 12 - 配置打包和发布

## 项目背景
动漫资源管理器桌面应用已完成核心功能开发，需要配置electron-builder进行打包发布，生成Windows可执行文件并进行测试。

## 用户需求
1. 生成Windows NSIS安装程序
2. 生成Windows便携版exe
3. 基本配置选项
4. 完整功能测试（安装、功能、卸载）

## 技术栈
- Electron 25.0.0
- electron-builder 24.0.0
- Windows平台

## 设计方案

### 1. electron-builder配置
采用基本配置方案，专注于生成可用的安装包：

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

### 2. 打包脚本优化
优化现有npm脚本，添加验证步骤：

- `npm run build` - 构建应用
- `npm run pack` - 生成未打包的应用目录（用于测试）
- `npm run dist` - 生成完整的安装包和便携版
- 添加构建前验证步骤

### 3. 测试方案
三级测试验证：

1. **基本安装测试**
   - 验证安装程序能正常运行
   - 检查安装路径是否正确
   - 确认桌面快捷方式创建

2. **完整功能测试**
   - 启动应用验证三大板块功能
   - 测试查询、写入、设置功能
   - 验证文件操作和工具配置

3. **卸载测试**
   - 验证卸载程序是否完全清理
   - 检查注册表项和用户数据清理

## 实施计划

### 阶段1：配置优化
1. 更新package.json中的build配置
2. 优化npm脚本
3. 验证配置有效性

### 阶段2：打包测试
1. 运行打包命令生成安装包
2. 测试NSIS安装程序
3. 测试便携版exe

### 阶段3：功能验证
1. 安装后启动应用测试
2. 验证所有核心功能
3. 测试卸载流程

## 成功标准
1. ✅ 成功生成NSIS安装程序
2. ✅ 成功生成便携版exe
3. ✅ 安装程序正常运行
4. ✅ 应用功能完整可用
5. ✅ 卸载程序正常工作

## 风险评估
1. **打包失败**: 依赖版本不兼容
   - 缓解: 使用固定版本，验证electron-builder配置
2. **安装问题**: Windows安全限制
   - 缓解: 测试不同Windows版本
3. **功能缺失**: 打包后功能异常
   - 缓解: 完整功能测试，验证所有模块

## 后续扩展
1. 添加应用图标
2. 配置代码签名
3. 支持自动更新
4. 多平台打包（macOS, Linux）