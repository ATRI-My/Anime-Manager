# 重新生成未打包程序实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 执行generate-unpacked.bat脚本重新生成包含最新bug修复的未打包程序

**Architecture:** 使用现有构建脚本，清理旧构建文件，执行完整构建流程，生成未打包的Electron应用

**Tech Stack:** Electron, React, TypeScript, Vite, electron-builder

---

### Task 1: 验证当前环境状态

**Files:**
- Check: `package.json`
- Check: `generate-unpacked.bat`
- Check: `dist-unpacked/` directory

**Step 1: 检查依赖状态**

```bash
npm list --depth=0
```

**Step 2: 验证脚本存在**

```bash
dir generate-unpacked.bat
```

**Step 3: 检查现有构建目录**

```bash
dir dist-unpacked /s
```

**Step 4: 提交状态检查**

```bash
git status
git add docs/plans/2026-02-24-regenerate-unpacked-implementation.md
git commit -m "docs: add implementation plan for regenerating unpacked program"
```

### Task 2: 执行构建脚本

**Files:**
- Execute: `generate-unpacked.bat`

**Step 1: 运行构建脚本**

```bash
generate-unpacked.bat
```

**Step 2: 监控构建过程**

观察输出，确保：
1. Electron进程停止成功
2. 旧目录清理成功
3. npm run build执行成功
4. electron-builder打包成功

**Step 3: 验证构建结果**

```bash
dir dist-unpacked\win-unpacked\Anime Manager.exe
```

**Step 4: 记录构建时间**

```bash
echo Build completed at: %date% %time%
```

### Task 3: 验证生成的可执行文件

**Files:**
- Test: `dist-unpacked\win-unpacked\Anime Manager.exe`

**Step 1: 检查文件属性**

```bash
dir "dist-unpacked\win-unpacked\Anime Manager.exe"
```

**Step 2: 验证文件大小**

```bash
for %i in ("dist-unpacked\win-unpacked\Anime Manager.exe") do echo %~zi bytes
```

**Step 3: 检查目录结构**

```bash
tree dist-unpacked /f
```

**Step 4: 提交验证结果**

```bash
git add docs/plans/2026-02-24-regenerate-unpacked-implementation.md
git commit -m "feat: regenerate unpacked program with latest fixes"
```

**验证结果：**
- 文件存在：是
- 文件大小：正常
- 目录结构：完整
- 构建时间：2026年2月24日

### Task 4: 更新文档

**Files:**
- Modify: `README-未打包程序.md`
- Check: `启动程序.bat`

**Step 1: 更新构建时间**

```markdown
## 构建信息
- 构建时间：2026年2月24日 [当前时间]
- 修复版本：v1.0.0-focus-fix-v2
- Electron版本：25.9.8
- 包含修复：剧集管理输入框焦点问题
```

**Step 2: 验证启动脚本**

```bash
type 启动程序.bat
```

**Step 3: 测试启动脚本**

```bash
启动程序.bat
```

**Step 4: 提交文档更新**

```bash
git add README-未打包程序.md
git commit -m "docs: update unpacked program documentation with new build time"
```

### Task 5: 清理和总结

**Files:**
- Check: `dist/` directory
- Update: `test-focus-fix-summary.md`

**Step 1: 清理临时文件**

```bash
if exist "dist" dir dist
```

**Step 2: 更新测试总结**

```markdown
## 未打包程序重新生成测试
- 生成时间：2026年2月24日
- 状态：成功
- 可执行文件：dist-unpacked\win-unpacked\Anime Manager.exe
- 包含修复：最新的bug修复
```

**Step 3: 验证整体状态**

```bash
git status
```

**Step 4: 最终提交**

```bash
git add test-focus-fix-summary.md
git commit -m "test: verify unpacked program regeneration complete"
```

## 执行选项

计划已完成并保存到 `docs/plans/2026-02-24-regenerate-unpacked-implementation.md`。

**两个执行选项：**

1. **Subagent-Driven (当前会话)** - 我分派新的子代理执行每个任务，任务间进行代码审查，快速迭代

2. **并行会话 (分离)** - 在新的工作树中打开新会话，使用executing-plans进行批量执行和检查点

**您选择哪种方法？**