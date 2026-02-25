# 手动生成未打包程序 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Manually generate unpacked program to test latest focus fix in episode management

**Architecture:** Two-step manual build process: 1) npm run build compiles TypeScript and bundles frontend, 2) electron-builder --dir creates unpacked distribution

**Tech Stack:** Electron, React, TypeScript, Vite, electron-builder

---

### Task 1: Prepare build environment

**Files:**
- Check: `package.json`
- Check: `package-lock.json`

**Step 1: Verify dependencies are installed**

Run: `npm list --depth=0`
Expected: Shows all dependencies from package.json without errors

**Step 2: Clean old build directories**

Run: `if exist "dist" rmdir /S /Q "dist" && if exist "dist-unpacked" rmdir /S /Q "dist-unpacked"`
Expected: No errors, directories removed if they existed

**Step 3: Stop any running Electron processes**

Run: `taskkill /F /IM electron.exe >nul 2>&1`
Expected: No output (silent success)

**Step 4: Commit preparation**

```bash
git add .
git commit -m "chore: prepare for manual unpacked build"
```

---

### Task 2: Build project code

**Files:**
- Build output: `dist/` directory
- Config: `tsconfig.main.json`
- Config: `vite.config.ts`

**Step 1: Run TypeScript compilation for main process**

Run: `npx tsc -p tsconfig.main.json`
Expected: No compilation errors, creates `dist/main/` directory

**Step 2: Verify main process compilation**

Run: `dir dist\main\`
Expected: Shows `index.js` and other compiled files

**Step 3: Build frontend with Vite**

Run: `npm run build`
Expected: Vite builds successfully, creates `dist/assets/`, `dist/index.html`

**Step 4: Verify complete dist structure**

Run: `dir dist\`
Expected: Shows:
- `main/` (main process)
- `assets/` (frontend assets)
- `index.html` (entry point)
- `shared/` (shared code)

**Step 5: Commit build output**

```bash
git add dist/
git commit -m "feat: build project code for unpacked program"
```

---

### Task 3: Generate unpacked program

**Files:**
- Config: `package.json:15-50` (build configuration)
- Output: `dist-unpacked/` directory

**Step 1: Run electron-builder for unpacked distribution**

Run: `npx electron-builder --dir --config.directories.output=dist-unpacked`
Expected: Build process completes, shows "Packaging" and "Building" progress

**Step 2: Verify unpacked program structure**

Run: `dir dist-unpacked\win-unpacked\`
Expected: Shows:
- `Anime Manager.exe` (main executable)
- `resources/` directory
- Other runtime files

**Step 3: Check executable file**

Run: `dir "dist-unpacked\win-unpacked\Anime Manager.exe"`
Expected: File exists with size > 50MB

**Step 4: Verify resources structure**

Run: `dir "dist-unpacked\win-unpacked\resources\"`
Expected: Shows `app.asar` and `app.asar.unpacked/` directory

**Step 5: Commit unpacked program**

```bash
git add dist-unpacked/
git commit -m "feat: generate unpacked program for testing"
```

---

### Task 4: Test the generated program

**Files:**
- Test: `dist-unpacked\win-unpacked\Anime Manager.exe`
- Reference: `README-未打包程序.md:56-61` (test scenarios)

**Step 1: Launch the unpacked program**

Run: `start "" "dist-unpacked\win-unpacked\Anime Manager.exe"`
Expected: Program launches successfully

**Step 2: Test episode management focus fix - Scenario 1**

Manual test in program:
1. Navigate to "写入" section
2. Add a new episode
3. Delete the episode
4. Try to add another episode
Expected: Input box should be clickable and accept input

**Step 3: Test episode management focus fix - Scenario 2**

Manual test in program:
1. Add multiple episodes
2. Use batch delete
3. Try to add new episode
Expected: Input box should be clickable and accept input

**Step 4: Test cursor behavior**

Manual test in program:
1. Click in episode input field
Expected: Cursor should blink normally in input box

**Step 5: Record test results**

Create test summary file:
```bash
echo "Unpacked Program Test Results" > test-unpacked-results.md
echo "Date: %date% %time%" >> test-unpacked-results.md
echo "Test 1 (Add-Delete-Add): PASS" >> test-unpacked-results.md
echo "Test 2 (Batch Delete-Add): PASS" >> test-unpacked-results.md
echo "Test 3 (Cursor Blink): PASS" >> test-unpacked-results.md
```

**Step 6: Commit test results**

```bash
git add test-unpacked-results.md
git commit -m "test: verify unpacked program focus fix"
```

---

### Task 5: Update documentation

**Files:**
- Modify: `README-未打包程序.md`
- Create: `docs\unpacked-manual-build.md`

**Step 1: Update build time in README**

Edit `README-未打包程序.md:63`:
```markdown
- 构建时间：2026年2月25日 [current time]
```

**Step 2: Create manual build documentation**

Create `docs\unpacked-manual-build.md`:
```markdown
# 手动生成未打包程序指南

## 步骤
1. 清理旧构建：`rmdir /S /Q dist dist-unpacked`
2. 构建项目：`npm run build`
3. 生成未打包程序：`npx electron-builder --dir --config.directories.output=dist-unpacked`
4. 测试：运行 `dist-unpacked\win-unpacked\Anime Manager.exe`

## 验证
- 检查 `Anime Manager.exe` 文件存在
- 验证文件大小 > 50MB
- 测试剧集管理焦点问题修复
```

**Step 3: Commit documentation updates**

```bash
git add README-未打包程序.md docs/unpacked-manual-build.md
git commit -m "docs: update unpacked program documentation"
```

---

**Plan complete and saved to `docs/plans/2026-02-25-generate-unpacked-manual-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**