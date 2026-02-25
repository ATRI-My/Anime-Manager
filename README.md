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

## 测试数据设置指南

### 文件位置
番剧信息JSON文件应该放在Electron的用户数据目录：

**Windows**: `%APPDATA%\anime-manager\anime-data.json`
- 示例: `C:\Users\你的用户名\AppData\Roaming\anime-manager\anime-data.json`

**macOS**: `~/Library/Application Support/anime-manager/anime-data.json`

**Linux**: `~/.config/anime-manager/anime-data.json`

**重要**: 目录名基于package.json中的`name`字段 (`anime-manager`)，不是应用显示名称。

### 快速设置方法

#### 方法1：使用批处理脚本（Windows）
运行 `setup-test-data.bat` 自动复制文件。

#### 方法2：手动操作
1. 打开文件资源管理器
2. 在地址栏输入 `%APPDATA%` 并按回车
3. 创建 `anime-manager` 文件夹（如果不存在）
4. 将 `example-anime-data.json` 复制到该文件夹，重命名为 `anime-data.json`

#### 方法3：通过程序自动创建
如果文件不存在，程序首次启动时会创建空的 `anime-data.json` 文件。

### 数据结构说明
JSON文件必须符合以下格式：

```json
{
  "version": "1.0.0",
  "animeList": [
    {
      "id": "唯一ID",
      "title": "番剧标题",
      "watchMethod": "观看方式", // "本地播放器"、"在线观看"、"下载观看"
      "description": "描述（可选）",
      "tags": ["标签1", "标签2"],
      "episodes": [
        {
          "id": "剧集ID",
          "number": 1,
          "title": "剧集标题",
          "url": "播放地址",
          "watched": false,
          "notes": "备注（可选）"
        }
      ],
      "createdAt": "创建时间",
      "updatedAt": "更新时间"
    }
  ]
}
```

### 示例文件内容
`example-anime-data.json` 包含5个测试番剧：

1. **咒术回战 第二季** - 3集，在线观看
2. **葬送的芙莉莲** - 4集，本地播放器  
3. **间谍过家家** - 3集，下载观看
4. **鬼灭之刃 游郭篇** - 5集，在线观看
5. **孤独摇滚！** - 3集，本地播放器

### 验证步骤
1. 放置文件到正确位置
2. 运行 `dist\win-unpacked\Anime Manager.exe`
3. 程序应该显示5个番剧卡片
4. 点击任意番剧应该显示剧集列表

### 故障排除
如果程序显示空白：
1. 检查文件路径是否正确
2. 检查JSON格式是否有效（可以使用JSON验证工具）
3. 查看开发者工具控制台（F12）的错误信息
4. 确保文件编码为UTF-8

## 开发指南

### 技术栈
- **前端**: React 18, TypeScript
- **构建工具**: Vite
- **桌面框架**: Electron
- **样式**: Tailwind CSS
- **打包**: electron-builder

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件化架构

### 测试
运行测试：
```bash
npm test
```

## 构建配置

### 主要配置
- `package.json` - 项目配置和脚本
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `electron-builder` - 应用程序打包配置

### 构建选项
- `npm run build` - 构建应用代码
- `npm run pack` - 生成未打包版本
- `npm run dist` - 生成安装包
- `npm run dist:win` - 生成 Windows 安装包

## 新增功能说明

### 剧集编辑保存功能改进（2026-02-21）

**问题修复**：解决了用户编辑剧集后需要手动保存的问题，添加了明确的保存提示系统。

**新增功能**：
1. **未保存修改提示横幅** - 页面顶部显示黄色横幅，提示有未保存修改
2. **增强状态显示** - 文件状态栏显示"⚠️ 有未保存的修改"和"✓ 文件已保存"
3. **操作后Toast提示** - 编辑/添加/删除剧集后显示"修改已保存到内存"提示
4. **保存按钮高亮** - 有未保存修改时保存按钮变为蓝色高亮
5. **页面切换保护** - 离开页面时提示保存未保存的修改
6. **应用关闭保护** - 关闭应用时提示保存未保存的修改

**使用流程**：
1. 编辑剧集 → 点击"更新剧集"
2. 显示Toast："修改已保存到内存"
3. 状态栏变为："⚠️ 有未保存的修改"
4. 保存按钮高亮显示
5. 点击保存 → 数据持久化
6. 状态恢复："✓ 文件已保存"

### WritePage状态管理重构（2026-02-23）

**问题修复**：解决了WritePage添加新行功能的状态同步问题，简化了状态管理架构。

**重构内容**：
1. **状态管理简化** - 将双重状态管理（selectedAnime + state.animeList）改为单一状态管理（selectedAnimeId + 计算属性）
2. **移除hack代码** - 去除了所有setTimeout和焦点处理hack
3. **错误处理增强** - 添加了更完善的错误处理和恢复机制
4. **性能优化** - 使用useMemo优化计算属性性能

**技术改进**：
- 代码行数减少约40行
- 状态同步逻辑完全移除
- 添加流程更简洁可靠
- 类型安全性更好

## 文档
- [设计文档](docs/plans/) - 项目设计和实施计划
- [使用说明](docs/unpacked-usage.md) - 未打包版本使用指南
- [测试报告](test-reports/) - 应用程序测试结果

## 构建信息
- 构建时间：2026年2月25日 19:02
- 修复版本：v1.0.0-focus-fix-v2
- Electron版本：25.9.8
- 包含修复：剧集管理输入框焦点问题

## 许可证
MIT License