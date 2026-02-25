# 动漫管理工具

动漫资源管理器桌面应用，基于 Electron + React + TypeScript 构建。

## 功能特性

- 🎬 动漫资源管理
- 🔍 智能搜索和过滤
- 📁 文件系统集成
- 🎨 现代化用户界面
- ⚡ 高性能虚拟滚动
- 📊 数据统计和分析
- ⚠️ 未保存修改提示系统（新增）
- 💾 增强的保存状态显示（新增）
- 🛡️ 页面切换和应用关闭保护（新增）

## 快速开始

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 构建应用程序

#### 生成未打包版本（开发测试）
```bash
npm run build
npm run pack
```

未打包版本位于：`dist/win-unpacked/`

#### 生成安装包
```bash
npm run dist
```

## 项目结构

```
src/
├── main/           # Electron 主进程
├── renderer/       # React 渲染进程
└── shared/         # 共享代码
```

## 未打包程序使用

### 已修复的问题
在本次更新中，修复了剧集管理中的输入框焦点问题：

#### 问题描述
在写入板块中，剧集管理里一旦使用了删除或批量删除功能，再打开添加新行的弹窗输入框就无法点击、输入。但这时点一下软件界面外的任意位置，就会恢复功能。

#### 修复内容
1. **修复了事件处理问题**：移除了阻止输入框获得焦点的事件处理器
2. **简化了焦点管理**：移除了复杂的焦点设置代码，改为简单的延迟焦点设置
3. **优化了状态管理**：避免了删除操作后不必要的全局状态刷新

### 如何运行未打包程序

#### 方法1：使用启动脚本（推荐）
1. 双击 `启动程序.bat`
2. 程序将自动启动

#### 方法2：手动运行
1. 进入 `dist-unpacked\win-unpacked\` 目录
2. 双击 `Anime Manager.exe`

#### 方法3：开发模式运行
```bash
npm run dev
```

### 文件结构
```
dist-unpacked/
└── win-unpacked/
    ├── Anime Manager.exe      # 主程序
    ├── resources/             # 资源文件
    │   ├── app.asar           # 打包的应用代码
    │   └── app.asar.unpacked/ # 解压的代码（包含dist目录）
    └── 其他依赖文件...
```

### 如何生成未打包程序
运行以下命令生成最新版本的未打包程序：

```bash
generate-unpacked.bat
```

或手动执行：

```bash
npm run build
npx electron-builder --dir --config.directories.output=dist-unpacked
```

## 焦点修复详细说明

### 问题描述
用户报告：在写入板块中，剧集管理里一旦使用了删除或批量删除功能，再打开添加新行的弹窗输入框就无法点击、输入。但这时点一下软件界面外的任意位置，就会恢复功能。

具体表现：
1. 删除操作后，弹窗打开时输入框显示为灰色/禁用状态
2. 鼠标移到输入框上时光标会正常变化
3. 点击输入框后不会选中变蓝（焦点没有设置）
4. 点击软件窗口外任意位置，输入框突然就可以点击了

### 根本原因分析
经过分析，问题的根本原因是：**删除操作后，某些元素（如删除按钮）可能仍然保持着焦点，或者焦点被设置到了不可见的元素上，导致新打开的模态框中的输入框无法获得焦点**。

当用户点击软件窗口外时，浏览器会清除所有焦点，然后输入框才能正常工作。

### 修复方案

#### 1. 删除操作后清除焦点（WritePage.tsx）
```typescript
// 关键修复：清除任何可能残留的焦点
setTimeout(() => {
  // 清除文档焦点
  if (document.activeElement && document.activeElement !== document.body) {
    (document.activeElement as HTMLElement).blur();
  }
  // 确保body获得焦点
  document.body.focus();
}, 10);
```

#### 2. 模态框打开时强制设置焦点（EpisodeModal.tsx）
```typescript
// 关键修复：先清除所有焦点，再设置到输入框
const setupFocus = () => {
  // 1. 首先清除任何现有的焦点
  if (document.activeElement && document.activeElement !== document.body) {
    (document.activeElement as HTMLElement).blur();
  }
  
  // 2. 给body设置焦点（作为焦点重置）
  document.body.focus();
  
  // 3. 确保输入框没有被禁用
  if (firstInput.disabled) {
    firstInput.disabled = false;
  }
  
  // 4. 设置焦点到输入框
  firstInput.focus();
};
```

#### 3. 确保输入框可交互（EpisodeForm.tsx）
```typescript
// 关键修复：确保输入框没有被禁用
const ensureInputEnabled = () => {
  if (numberInputRef.current) {
    const input = numberInputRef.current;
    
    if (input.disabled) {
      console.warn('EpisodeForm: 输入框被禁用，正在启用');
      input.disabled = false;
    }
    
    // 确保可以接收事件
    const computedStyle = window.getComputedStyle(input);
    if (computedStyle.pointerEvents === 'none') {
      console.warn('EpisodeForm: 输入框pointer-events为none，正在修复');
      input.style.pointerEvents = 'auto';
    }
  }
};
```

### 测试修复
请测试以下场景以确保焦点问题已修复：
1. 添加剧集 → 删除剧集 → 再次添加新剧集（输入框应该能正常点击和输入）
2. 批量删除剧集 → 添加新剧集（输入框应该能正常点击和输入）
3. 多次重复删除和添加操作，确保稳定性
4. 验证光标在输入框中正常闪烁

### 测试方法

#### 测试场景1：单个删除
1. 进入"写入"板块
2. 选择一个番剧
3. 添加一个剧集
4. 删除该剧集
5. 立即点击"添加新行"按钮
6. **预期结果**：弹窗打开，输入框可以立即点击和输入

#### 测试场景2：批量删除
1. 进入"写入"板块
2. 选择一个番剧
3. 添加多个剧集
4. 勾选多个剧集进行批量删除
5. 立即点击"添加新行"按钮
6. **预期结果**：弹窗打开，输入框可以立即点击和输入

#### 测试场景3：多次操作
1. 重复进行添加、删除、再添加的操作
2. **预期结果**：每次添加新剧集时，输入框都能正常工作