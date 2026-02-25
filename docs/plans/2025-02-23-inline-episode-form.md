# InlineEpisodeForm Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an inline episode form component for editing episodes without modal dialogs

**Architecture:** React functional component with TypeScript, form validation hooks, and inline editing UX

**Tech Stack:** React, TypeScript, Tailwind CSS, custom form validation hooks

---

### Task 1: Create InlineEpisodeForm component structure

**Files:**
- Create: `src/renderer/components/common/InlineEpisodeForm.tsx`

**Step 1: Create component file with basic structure**

```typescript
import React, { useState, useRef, useEffect } from 'react';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';
import { Episode } from '../../../shared/types';

interface EpisodeFormData {
  number: number;
  title: string;
  url: string;
  watched: boolean;
  notes?: string;
}

interface InlineEpisodeFormProps {
  onSubmit: (data: EpisodeFormData) => void;
  initialData?: Partial<EpisodeFormData>;
  onCancel?: () => void;
  onDelete?: () => void;
  enableValidation?: boolean;
  isEditing?: boolean;
  className?: string;
}

const InlineEpisodeForm: React.FC<InlineEpisodeFormProps> = ({
  onSubmit,
  initialData = {},
  className = '',
  onCancel,
  onDelete,
  enableValidation = true,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<EpisodeFormData>({
    number: initialData.number || 1,
    title: initialData.title || '',
    url: initialData.url || '',
    watched: initialData.watched || false,
    notes: initialData.notes || '',
  });
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);
  
  const { errors, validate } = useFormValidation(
    enableValidation ? {
      number: {
        required: true,
        validate: (value: number) => value > 0,
        message: '剧集编号必须大于0'
      },
      title: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: '剧集标题不能为空'
      },
      url: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: '剧集链接不能为空'
      }
    } : {}
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'number') {
      const numValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 1 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enableValidation) {
      const isValid = validate(formData);
      if (!isValid) {
        return;
      }
    }
    
    onSubmit(formData);
  };
  
  const handleReset = () => {
    setFormData({
      number: initialData.number || 1,
      title: initialData.title || '',
      url: initialData.url || '',
      watched: initialData.watched || false,
      notes: initialData.notes || '',
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* 表单内容将在后续步骤添加 */}
    </form>
  );
};

export default InlineEpisodeForm;
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: create InlineEpisodeForm component structure"
```

---

### Task 2: Add form fields and UI

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx`

**Step 1: Replace form content with actual fields**

Replace the empty form return with:

```typescript
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 剧集编号 */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
            剧集编号
          </label>
          <input
            type="number"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number}</p>
          )}
        </div>

        {/* 是否已观看 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="watched"
            name="watched"
            checked={formData.watched}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="watched" className="ml-2 block text-sm text-gray-700">
            已观看
          </label>
        </div>
      </div>

      {/* 剧集标题 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          剧集标题 *
        </label>
        <input
          ref={titleInputRef}
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="请输入剧集标题"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* 剧集链接 */}
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.url ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://example.com/episode-1"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
      </div>

      {/* 备注 */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="可选备注信息"
        />
      </div>

      {/* 按钮组 */}
      <div className="flex justify-end space-x-3 pt-4">
        {onDelete && isEditing && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            删除
          </button>
        )}
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            取消
          </button>
        )}
        
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          重置
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? '更新' : '添加'}
        </button>
      </div>
    </form>
  );
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add form fields and UI to InlineEpisodeForm"
```

---

### Task 3: Add keyboard shortcuts and accessibility

**Files:**
- Modify: `src/renderer/components/common/InlineEpisodeForm.tsx`

**Step 1: Add keyboard event handling**

Add this useEffect hook after the existing useEffect:

```typescript
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSubmit(e as any);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);
```

**Step 2: Add aria labels and accessibility attributes**

Update the form opening tag:

```typescript
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-4 ${className}`}
      aria-label={isEditing ? '编辑剧集表单' : '添加剧集表单'}
    >
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.tsx
git commit -m "feat: add keyboard shortcuts and accessibility to InlineEpisodeForm"
```

---

### Task 4: Create basic test file

**Files:**
- Create: `src/renderer/components/common/InlineEpisodeForm.test.tsx`

**Step 1: Create test file**

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InlineEpisodeForm from './InlineEpisodeForm';

describe('InlineEpisodeForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();
  const mockDelete = jest.fn();

  const defaultProps = {
    onSubmit: mockSubmit,
    onCancel: mockCancel,
    onDelete: mockDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with default values', () => {
    render(<InlineEpisodeForm {...defaultProps} />);
    
    expect(screen.getByLabelText('剧集编号')).toBeInTheDocument();
    expect(screen.getByLabelText('剧集标题 *')).toBeInTheDocument();
    expect(screen.getByLabelText('剧集链接 *')).toBeInTheDocument();
    expect(screen.getByLabelText('备注')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '已观看' })).toBeInTheDocument();
  });

  it('renders with initial data', () => {
    const initialData = {
      number: 5,
      title: 'Test Episode',
      url: 'https://example.com/ep5',
      watched: true,
      notes: 'Test notes',
    };

    render(
      <InlineEpisodeForm
        {...defaultProps}
        initialData={initialData}
        isEditing={true}
      />
    );

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Episode')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/ep5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '已观看' })).toBeChecked();
  });

  it('calls onSubmit with form data', () => {
    render(<InlineEpisodeForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText('剧集编号'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('剧集标题 *'), { target: { value: 'New Episode' } });
    fireEvent.change(screen.getByLabelText('剧集链接 *'), { target: { value: 'https://example.com/ep3' } });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      number: 3,
      title: 'New Episode',
      url: 'https://example.com/ep3',
      watched: false,
      notes: '',
    });
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<InlineEpisodeForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    
    expect(mockCancel).toHaveBeenCalled();
  });

  it('shows delete button when isEditing is true', () => {
    render(<InlineEpisodeForm {...defaultProps} isEditing={true} />);
    
    expect(screen.getByRole('button', { name: '删除' })).toBeInTheDocument();
  });

  it('does not show delete button when isEditing is false', () => {
    render(<InlineEpisodeForm {...defaultProps} isEditing={false} />);
    
    expect(screen.queryByRole('button', { name: '删除' })).not.toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

Run: `npm test -- InlineEpisodeForm.test.tsx`
Expected: Tests pass

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.test.tsx
git commit -m "test: add basic tests for InlineEpisodeForm"
```

---

### Task 5: Add component documentation

**Files:**
- Create: `src/renderer/components/common/InlineEpisodeForm.stories.tsx`

**Step 1: Create Storybook story**

```typescript
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import InlineEpisodeForm from './InlineEpisodeForm';

export default {
  title: 'Components/Common/InlineEpisodeForm',
  component: InlineEpisodeForm,
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    onDelete: { action: 'deleted' },
  },
} as Meta<typeof InlineEpisodeForm>;

const Template: StoryFn<typeof InlineEpisodeForm> = (args) => (
  <div className="max-w-2xl mx-auto p-4">
    <InlineEpisodeForm {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  isEditing: false,
};

export const EditingMode = Template.bind({});
EditingMode.args = {
  isEditing: true,
  initialData: {
    number: 5,
    title: 'The Adventure Begins',
    url: 'https://example.com/episode-5',
    watched: true,
    notes: 'This is an important episode',
  },
};

export const WithoutValidation = Template.bind({});
WithoutValidation.args = {
  enableValidation: false,
};

export const Compact = Template.bind({});
Compact.args = {
  className: 'max-w-md',
};
```

**Step 2: Create README documentation**

Create: `src/renderer/components/common/InlineEpisodeForm.md`

```markdown
# InlineEpisodeForm Component

内联剧集表单组件，用于在不使用弹窗的情况下编辑剧集信息。

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(data: EpisodeFormData) => void` | **Required** | 表单提交回调 |
| `initialData` | `Partial<EpisodeFormData>` | `{}` | 初始表单数据 |
| `onCancel` | `() => void` | `undefined` | 取消按钮回调 |
| `onDelete` | `() => void` | `undefined` | 删除按钮回调 |
| `enableValidation` | `boolean` | `true` | 是否启用表单验证 |
| `isEditing` | `boolean` | `false` | 是否为编辑模式 |
| `className` | `string` | `''` | 自定义CSS类名 |

## EpisodeFormData Interface

```typescript
interface EpisodeFormData {
  number: number;      // 剧集编号
  title: string;       // 剧集标题
  url: string;         // 剧集链接
  watched: boolean;    // 是否已观看
  notes?: string;      // 备注（可选）
}
```

## Features

- **内联编辑**: 直接在列表中进行编辑，无需弹窗
- **表单验证**: 内置必填字段验证
- **键盘快捷键**: 
  - `Escape`: 取消编辑
  - `Ctrl/Cmd + Enter`: 提交表单
- **自动聚焦**: 组件挂载时自动聚焦到标题输入框
- **响应式布局**: 适配不同屏幕尺寸

## Usage Example

```typescript
import InlineEpisodeForm from './InlineEpisodeForm';

const Example = () => {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <InlineEpisodeForm
      onSubmit={handleSubmit}
      initialData={{ number: 1, title: 'Episode 1' }}
      isEditing={true}
      onCancel={() => console.log('Cancelled')}
    />
  );
};
```

## Validation Rules

1. 剧集编号必须大于0
2. 剧集标题不能为空
3. 剧集链接不能为空

可以通过 `enableValidation={false}` 禁用验证。
```

**Step 3: Commit**

```bash
git add src/renderer/components/common/InlineEpisodeForm.stories.tsx src/renderer/components/common/InlineEpisodeForm.md
git commit -m "docs: add stories and documentation for InlineEpisodeForm"
```

---

### Task 6: Final verification

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 2: Run lint check**

Run: `npm run lint`
Expected: No lint errors

**Step 3: Run tests**

Run: `npm test -- --coverage`
Expected: All tests pass with good coverage

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: final verification for InlineEpisodeForm component"
```

---

Plan complete and saved to `docs/plans/2025-02-23-inline-episode-form.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**