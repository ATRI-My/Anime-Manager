# Anime Manager - 动漫资源管理器

一个现代化的动漫资源管理桌面应用，使用 Electron + React + TypeScript 构建。

> **AI 生成声明**: 本项目的大部分代码和文档是通过 AI 辅助生成的，展示了 AI 在软件开发中的实际应用。

## ✨ 功能特性

### 🎬 动漫管理
- 完整的动漫信息管理（标题、描述、标签、观看方式）
- 剧集管理（集数、标题、链接、观看状态）
- 智能搜索和过滤功能

### 📁 文件系统集成
- 本地数据存储（JSON 格式）
- 支持自定义数据文件夹路径
- 自动保存和备份机制

### 🎨 现代化界面
- 响应式设计，支持暗色主题
- 标签页导航（查询、写入、设置）
- 实时表单验证和错误提示
- 虚拟滚动支持大量数据

### ⚡ 高级功能
- 未保存修改提示系统
- 增强的保存状态显示
- 页面切换和应用关闭保护
- 实时数据同步

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Windows 系统（支持其他平台但主要针对 Windows 优化）

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建应用
```bash
# 构建项目
npm run build

# 生成未打包版本（开发测试）
npm run pack

# 生成完整安装包
npm run dist
```

## 📦 项目结构

```
anime-manager/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 主进程入口
│   │   ├── preload.ts  # 预加载脚本
│   │   └── file-system.ts # 文件系统操作
│   ├── renderer/       # React 渲染进程
│   │   ├── App.tsx     # 主应用组件
│   │   ├── components/ # React 组件
│   │   ├── contexts/   # React 上下文
│   │   ├── hooks/      # 自定义 Hooks
│   │   └── utils/      # 工具函数
│   └── shared/         # 共享代码
│       ├── types.ts    # TypeScript 类型定义
│       ├── utils.ts    # 共享工具函数
│       └── validation.ts # 数据验证
├── docs/               # 项目文档
│   ├── design/         # 设计文档
│   └── plans/          # 开发计划
├── scripts/            # 构建和开发脚本
└── dist/               # 构建输出目录（被 .gitignore 忽略）
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **桌面框架**: Electron 25
- **构建工具**: Vite 4
- **样式**: Tailwind CSS 3
- **数据存储**: JSON 文件（存储在用户数据目录）
- **虚拟滚动**: React Window
- **开发工具**: 
  - ESLint + TypeScript 类型检查
  - Concurrently 并行运行命令
  - Electron Builder 打包

## 🤖 AI 辅助开发

本项目是 AI 辅助开发的典型案例：

### AI 生成内容
- **代码生成**: 大部分 React 组件、TypeScript 类型定义、工具函数
- **文档生成**: README、设计文档、开发计划
- **测试代码**: 单元测试和集成测试
- **构建脚本**: 批处理文件和配置

### AI 协助解决的问题
1. **焦点管理**: 修复了表单输入框的焦点问题
2. **状态同步**: 实现了实时数据同步机制
3. **错误处理**: 增强了错误边界和用户提示
4. **性能优化**: 虚拟滚动和懒加载实现
5. **代码重构**: WritePage组件状态管理重构
6. **功能实现**: 设置页面数据文件夹功能

### 开发流程
1. **需求分析**: 通过对话明确功能需求
2. **计划制定**: 创建详细的实施计划文档
3. **AI 生成**: 生成初始代码和文档
4. **人工审查**: 检查代码质量和逻辑正确性
5. **迭代优化**: 基于反馈进行改进
6. **测试验证**: 确保功能完整性和稳定性

> **注意**: 部分计划文档中的技术栈描述（如Vue.js、SQLite）与实际实现（React、JSON存储）不一致，反映了开发过程中的技术决策变化。

## 📄 数据格式

### 动漫数据结构
```typescript
interface Anime {
  id: string
  title: string
  watchMethod: string
  description?: string
  tags: string[]
  episodes: Episode[]
  createdAt: string
  updatedAt: string
}

interface Episode {
  id: string
  number: number
  title: string
  url: string
  watched: boolean
  notes?: string
}
```

### 配置文件
- 数据存储位置: `%APPDATA%/AnimeManager/data.json`
- 支持自定义数据文件夹路径
- 自动备份机制

## 🔧 开发脚本

项目包含以下开发辅助脚本：

### 主要脚本
- `generate-unpacked.bat` - 生成未打包版本
- `cleanup.bat` - 清理项目文件
- `setup.bat` - 安装程序脚本

### 启动脚本
- `start-app.bat` - 启动应用程序
- `start-build.bat` - 启动构建版本

### 测试脚本
- `test-run.bat` - 运行环境测试
- `test-unpacked.bat` - 测试未打包版本

## 📚 文档

- `docs/design/` - 设计文档和架构说明
- `docs/plans/` - 详细的开发计划和实现记录
- `installation-guide.md` - 安装指南
- `environment-check.md` - 环境检查文档

## 🧪 测试

项目包含完整的测试套件：

```bash
# 运行测试（如果配置了测试框架）
npm test
```

测试覆盖：
- 数据验证逻辑
- 文件系统操作
- 组件渲染
- 状态管理

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 保持组件简洁和可复用
- 添加必要的注释和文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE.txt](LICENSE.txt) 文件了解详情。

## 🙏 致谢

- **AI 工具**: 感谢 AI 辅助工具在代码生成和问题解决中的帮助
- **开源社区**: 感谢所有使用的开源项目和库
- **贡献者**: 感谢所有为项目做出贡献的人

## 📞 支持

遇到问题？请：
1. 查看 [文档](docs/) 和 [问题记录](docs/plans/)
2. 检查现有 Issue
3. 创建新的 Issue 并详细描述问题

---

**项目状态**: 🟢 活跃开发中  
**最后更新**: 2026-03-01  
**版本**: 1.0.0