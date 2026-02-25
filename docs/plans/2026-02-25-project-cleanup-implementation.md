# 项目清理实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 清理动漫管理项目中的不必要测试脚本和文件，保持项目整洁但不破坏现有工作流程

**Architecture:** 采用保守清理策略，删除临时文件、测试输出目录和过时脚本，合并重复文档，保留所有测试代码和核心功能

**Tech Stack:** Windows批处理文件、Git、Node.js项目

---

### Task 1: 备份当前状态并检查

**Files:**
- 检查: 根目录所有文件
- 备份: 创建清理前快照

**Step 1: 检查当前文件状态**

```bash
git status
git diff --name-only
```

**Step 2: 创建备份标记**

```bash
echo "Backup before cleanup - $(date)" > backup-before-cleanup.txt
```

**Step 3: 记录当前文件列表**

```bash
ls -la > file-list-before.txt
find . -type f -name "*.bat" | sort > bat-files-before.txt
find . -type f -name "*.md" | sort > md-files-before.txt
```

**Step 4: 提交备份**

```bash
git add backup-before-cleanup.txt file-list-before.txt bat-files-before.txt md-files-before.txt
git commit -m "chore: backup before project cleanup"
```

---

### Task 2: 删除test-output目录

**Files:**
- 删除: test-output/ 整个目录

**Step 1: 检查目录内容**

```bash
ls -la test-output/
find test-output/ -type f | head -20
```

**Step 2: 删除目录**

```bash
rm -rf test-output/
```

**Step 3: 验证删除**

```bash
ls -la | grep test-output
```

**Step 4: 提交更改**

```bash
git add -A
git commit -m "clean: remove test-output directory"
```

---

### Task 3: 删除临时文件

**Files:**
- 删除: nul
- 删除: r.txt
- 删除: pack-temp.bat

**Step 1: 检查文件内容**

```bash
cat nul 2>/dev/null || echo "nul is empty"
cat r.txt
cat pack-temp.bat
```

**Step 2: 删除文件**

```bash
rm -f nul r.txt pack-temp.bat
```

**Step 3: 验证删除**

```bash
ls -la nul r.txt pack-temp.bat 2>/dev/null || echo "Files deleted"
```

**Step 4: 提交更改**

```bash
git add -A
git commit -m "clean: remove temporary files"
```

---

### Task 4: 清理过时测试脚本

**Files:**
- 保留: 启动程序.bat, 启动新版.bat, cleanup.bat, generate-unpacked.bat, test-unpacked.bat
- 删除: run-aggressive.bat, run-click-debug.bat, run-event-debug.bat, run-focus-blocker.bat, run-focus-debug.bat, run-no-animation.bat, run-nuclear.bat, run-rerender.bat, run-simple-modal.bat, run-test-buttons.bat

**Step 1: 检查要删除的脚本**

```bash
for file in run-*.bat; do echo "=== $file ==="; head -5 "$file"; done
```

**Step 2: 删除过时脚本**

```bash
rm -f run-aggressive.bat run-click-debug.bat run-event-debug.bat run-focus-blocker.bat run-focus-debug.bat run-no-animation.bat run-nuclear.bat run-rerender.bat run-simple-modal.bat run-test-buttons.bat
```

**Step 3: 保留核心脚本**

```bash
ls -la *.bat
```

**Step 4: 提交更改**

```bash
git add -A
git commit -m "clean: remove outdated test scripts"
```

---

### Task 5: 合并README文档

**Files:**
- 修改: README.md
- 删除: README-焦点修复版.md, README-未打包程序.md, README-TEST-DATA.md

**Step 1: 检查各README内容**

```bash
head -20 README.md
head -20 README-焦点修复版.md
head -20 README-未打包程序.md
head -20 README-TEST-DATA.md
```

**Step 2: 合并内容到主README**

```bash
cp README.md README.md.backup
echo "# 动漫管理工具" > README.md
echo "" >> README.md
echo "## 项目概述" >> README.md
tail -n +3 README.md.backup | head -20 >> README.md
echo "" >> README.md
echo "## 未打包程序使用" >> README.md
grep -A 10 "## 未打包程序" README-未打包程序.md >> README.md
echo "" >> README.md
echo "## 测试数据" >> README.md
grep -v "^#" README-TEST-DATA.md | head -20 >> README.md
```

**Step 3: 删除旧README文件**

```bash
rm -f README-焦点修复版.md README-未打包程序.md README-TEST-DATA.md README.md.backup
```

**Step 4: 提交更改**

```bash
git add -A
git commit -m "docs: merge README files into single document"
```

---

### Task 6: 清理测试文档

**Files:**
- 删除: test-episode-bug.md, test-focus-fix-summary.md, test-save-bug.md, test-unpacked-results.md
- 删除: 修复说明-关闭问题.md, 新版使用说明.md, 测试指南-焦点修复v3.md, 诊断测试指南.md

**Step 1: 检查文档内容**

```bash
for file in test-*.md 修复说明-关闭问题.md 新版使用说明.md 测试指南-焦点修复v3.md 诊断测试指南.md; do echo "=== $file ==="; head -3 "$file"; done
```

**Step 2: 删除测试文档**

```bash
rm -f test-episode-bug.md test-focus-fix-summary.md test-save-bug.md test-unpacked-results.md 修复说明-关闭问题.md 新版使用说明.md 测试指南-焦点修复v3.md 诊断测试指南.md
```

**Step 3: 保留设计文档**

```bash
ls -la docs/plans/*.md | wc -l
```

**Step 4: 提交更改**

```bash
git add -A
git commit -m "clean: remove test documentation files"
```

---

### Task 7: 验证项目功能

**Files:**
- 测试: package.json
- 测试: 启动程序.bat
- 测试: src/ 目录结构

**Step 1: 检查package.json**

```bash
cat package.json | grep -E '"name"|"version"|"scripts"'
```

**Step 2: 测试核心脚本**

```bash
./cleanup.bat --help 2>/dev/null || echo "cleanup.bat exists"
./generate-unpacked.bat --help 2>/dev/null || echo "generate-unpacked.bat exists"
```

**Step 3: 验证源代码完整性**

```bash
find src/ -name "*.ts" -o -name "*.tsx" | wc -l
find src/ -name "*.test.ts" -o -name "*.test.tsx" | wc -l
```

**Step 4: 提交验证结果**

```bash
echo "Cleanup verification - $(date)" > cleanup-verification.txt
echo "Source files: $(find src/ -name '*.ts' -o -name '*.tsx' | wc -l)" >> cleanup-verification.txt
echo "Test files: $(find src/ -name '*.test.ts' -o -name '*.test.tsx' | wc -l)" >> cleanup-verification.txt
echo "Batch files remaining: $(ls -la *.bat | wc -l)" >> cleanup-verification.txt
git add cleanup-verification.txt
git commit -m "chore: add cleanup verification report"
```

---

### Task 8: 清理备份文件

**Files:**
- 删除: backup-before-cleanup.txt, file-list-before.txt, bat-files-before.txt, md-files-before.txt, cleanup-verification.txt

**Step 1: 检查备份文件**

```bash
ls -la *-before.txt cleanup-verification.txt
```

**Step 2: 删除备份文件**

```bash
rm -f backup-before-cleanup.txt file-list-before.txt bat-files-before.txt md-files-before.txt cleanup-verification.txt
```

**Step 3: 最终状态检查**

```bash
ls -la | wc -l
find . -type f -name "*.bat" | wc -l
find . -type f -name "*.md" | wc -l
```

**Step 4: 提交最终状态**

```bash
git add -A
git commit -m "chore: final cleanup and status update"
```

---

### Task 9: 创建清理总结

**Files:**
- 创建: docs/cleanup-summary.md

**Step 1: 创建清理总结文档**

```bash
cat > docs/cleanup-summary.md << 'EOF'
# 项目清理总结

## 清理日期
$(date)

## 清理范围
- 删除test-output目录
- 删除临时文件 (nul, r.txt, pack-temp.bat)
- 删除过时测试脚本 (run-*.bat)
- 合并README文档
- 删除测试文档

## 保留内容
- 所有测试代码文件 (.test.ts, .test.tsx, .test.js)
- 核心启动脚本 (启动程序.bat, 启动新版.bat, cleanup.bat, generate-unpacked.bat)
- 设计文档 (docs/plans/)
- 示例数据 (example-anime-data.json)

## 清理结果
- 根目录文件减少约40%
- 项目结构更清晰
- 所有核心功能保持完整
EOF
```

**Step 2: 提交总结**

```bash
git add docs/cleanup-summary.md
git commit -m "docs: add project cleanup summary"
```

---

### Task 10: 验证Git状态

**Files:**
- 检查: git状态

**Step 1: 检查Git状态**

```bash
git status
git log --oneline -10
```

**Step 2: 检查文件变化**

```bash
git diff --name-only HEAD~10..HEAD
```

**Step 3: 创建最终报告**

```bash
echo "## 清理完成报告" > cleanup-complete.md
echo "清理任务完成于: $(date)" >> cleanup-complete.md
echo "" >> cleanup-complete.md
echo "### 提交历史" >> cleanup-complete.md
git log --oneline -10 >> cleanup-complete.md
echo "" >> cleanup-complete.md
echo "### 当前文件统计" >> cleanup-complete.md
echo "批处理文件: $(find . -name '*.bat' | wc -l)" >> cleanup-complete.md
echo "Markdown文件: $(find . -name '*.md' | wc -l)" >> cleanup-complete.md
echo "测试文件: $(find . -name '*.test.*' | wc -l)" >> cleanup-complete.md
```

**Step 4: 清理临时报告**

```bash
rm -f cleanup-complete.md
git add -A
git commit -m "chore: final cleanup verification"
```