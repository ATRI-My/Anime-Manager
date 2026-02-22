# 设置页面数据文件夹功能设计

## 概述
在动漫管理器应用的设置页面中，替换"应用设置"卡片中的扫描路径部分，添加数据文件夹信息和一键打开功能。

## 问题描述
当前设置页面的"应用设置"卡片包含硬编码的扫描路径和自动扫描选项，这些功能尚未实现。用户需要知道应用数据存储位置，并能够方便地访问数据文件夹。

## 解决方案
在"应用设置"卡片中替换扫描路径部分，添加：
1. 数据文件夹路径显示
2. 一键打开数据文件夹功能

## 技术规格

### 数据存储位置
- 实际路径：`app.getPath('userData')` (Windows: `%APPDATA%\anime-manager\`)
- 存储文件：`settings.json`, `anime-data.json`

### UI设计
```
应用设置
├─ 数据文件位置
│  ├─ 显示：%APPDATA%\anime-manager\
│  ├─ 说明：应用数据存储在此目录
│  └─ 按钮：[打开数据文件夹]
└─ 启动时自动扫描 [复选框]
```

### 功能需求
1. **路径显示**：静态显示Windows环境变量格式的路径
2. **打开功能**：点击按钮打开实际数据目录
3. **错误处理**：文件夹不存在时自动创建或显示错误提示
4. **IPC通信**：主进程添加`open-data-folder`处理器

## 实现计划

### 前端修改 (SettingsPage.tsx)
- 替换第93-104行的扫描路径部分
- 添加数据文件夹信息显示
- 添加打开文件夹按钮
- 调用新的IPC接口

### 主进程修改 (file-system.ts)
- 添加`open-data-folder` IPC处理器
- 使用`shell.openPath()`打开目录
- 确保目录存在（调用现有`ensure*FileExists`函数）

### IPC接口
```typescript
// 主进程
ipcMain.handle('open-data-folder', async () => {
  const userDataPath = app.getPath('userData')
  await shell.openPath(userDataPath)
})

// 渲染进程
const openDataFolder = async () => {
  await window.electronAPI?.openDataFolder?.()
}
```

## 文件修改清单
1. `src/renderer/components/SettingsPage/SettingsPage.tsx` - UI修改
2. `src/main/file-system.ts` - IPC处理器添加
3. `src/shared/types.ts` - 类型定义更新（可选）

## 测试验证
1. 打开设置页面，查看数据文件夹信息
2. 点击"打开数据文件夹"按钮，验证文件夹正确打开
3. 测试文件夹不存在时的行为
4. 验证现有功能不受影响

## 设计决策
- 使用静态路径显示而非动态获取，简化实现
- 保持现有UI样式和布局
- 重用现有的文件系统确保逻辑
- 最小化改动范围，只替换扫描路径部分