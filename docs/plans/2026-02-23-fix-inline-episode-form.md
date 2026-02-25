# Fix InlineEpisodeForm Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix InlineEpisodeForm component by removing unused imports, adding complete form fields, displaying validation errors, and using all props.

**Architecture:** Update the existing InlineEpisodeForm.tsx file to include all form fields for EpisodeFormData, display FormValidation component, add reset button, and properly use onCancel and onDelete props.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Remove unused Episode import

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:4`

**Step 1: Remove unused import**

```typescript
// Remove this line
import { Episode } from '../../../shared/types';
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors related to Episode import

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "refactor: remove unused Episode import from InlineEpisodeForm"
```

---

### Task 2: Add FormValidation component and error display

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add FormValidation component at top of form**

```typescript
return (
  <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
    {/* 显示验证错误 */}
    {errors.length > 0 && (
      <div className="mb-4">
        <FormValidation errors={errors} />
      </div>
    )}
    
    {/* 表单内容将在后续步骤添加 */}
  </form>
);
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add FormValidation component to InlineEpisodeForm"
```

---

### Task 3: Add episode number input field

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add number input field after FormValidation**

```typescript
return (
  <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
    {/* 显示验证错误 */}
    {errors.length > 0 && (
      <div className="mb-4">
        <FormValidation errors={errors} />
      </div>
    )}
    
    {/* 剧集编号输入框 */}
    <div>
      <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
        剧集编号 *
      </label>
      <input
        type="number"
        id="number"
        name="number"
        value={formData.number}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
        min="1"
      />
    </div>
    
    {/* 表单内容将在后续步骤添加 */}
  </form>
);
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add episode number input to InlineEpisodeForm"
```

---

### Task 4: Add title input field

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add title input field after number field**

```typescript
    {/* 标题输入框 */}
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        剧集标题 *
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
        ref={titleInputRef}
        autoFocus
      />
    </div>
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add title input to InlineEpisodeForm"
```

---

### Task 5: Add URL input field

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add URL input field after title field**

```typescript
    {/* URL输入框 */}
    <div>
      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
        剧集链接 *
      </label>
      <input
        type="url"
        id="url"
        name="url"
        value={formData.url}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
        placeholder="https://example.com/episode.mp4"
      />
    </div>
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add URL input to InlineEpisodeForm"
```

---

### Task 6: Add watched checkbox field

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add watched checkbox field after URL field**

```typescript
    {/* 观看状态复选框 */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="watched"
        name="watched"
        checked={formData.watched}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="watched" className="ml-2 block text-sm text-gray-700">
        已观看
      </label>
    </div>
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add watched checkbox to InlineEpisodeForm"
```

---

### Task 7: Add notes textarea field

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add notes textarea field after watched checkbox**

```typescript
    {/* 备注文本域 */}
    <div>
      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
        备注 (可选)
      </label>
      <textarea
        id="notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="添加备注..."
      />
    </div>
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add notes textarea to InlineEpisodeForm"
```

---

### Task 8: Add button group with reset and submit

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx:106-110`

**Step 1: Add button group after all form fields**

```typescript
    {/* 按钮组 */}
    <div className="flex justify-between pt-4">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          重置
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
        )}
      </div>
      
      <div className="flex space-x-2">
        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            删除
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? '更新' : '添加'}
        </button>
      </div>
    </div>
```

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add button group with reset, cancel, delete, and submit buttons"
```

---

### Task 9: Final verification

**Files:**
- Check: `src/renderer/components/common/InlineEpisodeForm.tsx`

**Step 1: Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 2: Verify complete form structure**

Check that the form includes:
1. FormValidation component display
2. Number input field
3. Title input field with autoFocus
4. URL input field
5. Watched checkbox
6. Notes textarea
7. Complete button group with all props used

**Step 3: Create final commit summary**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "fix: complete InlineEpisodeForm structure and fix unused variables"
```

---

Plan complete and saved to `docs/plans/2026-02-23-fix-inline-episode-form.md`.

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?