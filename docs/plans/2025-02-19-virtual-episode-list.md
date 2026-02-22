# VirtualEpisodeList组件实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建基于react-window的VirtualEpisodeList组件，实现虚拟滚动以优化大量剧集数据的性能

**Architecture:** 基于现有EpisodeList组件的渲染逻辑，使用react-window的FixedSizeList实现虚拟滚动，保持相同的props接口，添加height和itemHeight配置参数

**Tech Stack:** React 18, TypeScript, react-window 2.2.7, Tailwind CSS

---

### Task 1: 创建VirtualEpisodeList组件文件

**Files:**
- Create: `src/renderer/components/common/VirtualEpisodeList.tsx`

**Step 1: 创建组件文件结构**

```tsx
import React, { useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Episode } from '../../../shared/types';

interface VirtualEpisodeListProps {
  episodes: Episode[];
  onSelectEpisode?: (episode: Episode) => void;
  onCopyUrl?: (url: string) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
  height?: number;
  itemHeight?: number;
}

const VirtualEpisodeList: React.FC<VirtualEpisodeListProps> = ({
  episodes,
  onSelectEpisode,
  onCopyUrl,
  onOpenUrl,
  className = '',
  height = 600,
  itemHeight = 80
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 复制URL处理函数
  const handleCopyUrl = async (e: React.MouseEvent, url: string, episodeId: string) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedId(episodeId);
      setTimeout(() => setCopiedId(null), 2000);
      
      if (onCopyUrl) {
        onCopyUrl(url);
      }
    } catch (err) {
      console.error('复制失败:', err);
      setCopiedId(episodeId);
      setTimeout(() => setCopiedId(null), 1000);
    }
  };

  const handleOpenUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (onOpenUrl) {
      onOpenUrl(url);
    }
  };

  const handleRowClick = (episode: Episode) => {
    if (onSelectEpisode) {
      onSelectEpisode(episode);
    }
  };

  const getWatchedStatus = (watched: boolean) => {
    return watched ? 'text-green-600' : 'text-gray-400';
  };

  // Row组件 - 渲染单个剧集行
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const episode = episodes[index];
    
    return (
      <tr 
        style={style}
        key={episode.id} 
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => handleRowClick(episode)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold">{episode.number}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{episode.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs" title={episode.url}>
            {episode.url}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <svg 
              className={`w-5 h-5 mr-2 ${getWatchedStatus(episode.watched)}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {episode.watched ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span className={`text-sm ${getWatchedStatus(episode.watched)}`}>
              {episode.watched ? '已观看' : '未观看'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={(e) => handleCopyUrl(e, episode.url, episode.id)}
              className={`px-3 py-1 rounded text-xs font-medium ${
                copiedId === episode.id 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
              title="复制链接"
            >
              {copiedId === episode.id ? '已复制' : '复制'}
            </button>
            <button
              onClick={(e) => handleOpenUrl(e, episode.url)}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200"
              title="打开链接"
            >
              打开
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (episodes.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无剧集</h3>
          <p className="mt-1 text-sm text-gray-500">还没有添加任何剧集。</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                集数
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <FixedSizeList
              height={height}
              itemCount={episodes.length}
              itemSize={itemHeight}
              width="100%"
            >
              {Row}
            </FixedSizeList>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VirtualEpisodeList;
```

**Step 2: 验证文件创建**

运行: `ls src/renderer/components/common/VirtualEpisodeList.tsx`
预期: 文件存在

**Step 3: 检查TypeScript类型**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 4: 提交**

```bash
git add src/renderer/components/common/VirtualEpisodeList.tsx
git commit -m "feat: add VirtualEpisodeList component with react-window"
```

---

### Task 2: 修复虚拟滚动表格布局问题

**Files:**
- Modify: `src/renderer/components/common/VirtualEpisodeList.tsx`

**Step 1: 修复FixedSizeList在tbody中的布局问题**

问题: FixedSizeList不能直接放在tbody中，需要调整HTML结构

**Step 2: 修改组件结构**

```tsx
// 在return语句中修改表格结构
return (
  <div className={`${className}`}>
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              集数
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标题
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
      </table>
      <div style={{ height: height }}>
        <FixedSizeList
          height={height}
          itemCount={episodes.length}
          itemSize={itemHeight}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  </div>
);
```

**Step 3: 修改Row组件返回完整的表格行**

```tsx
// 修改Row组件返回tr元素
const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const episode = episodes[index];
  
  return (
    <div style={style}>
      <table className="min-w-full">
        <tbody>
          <tr 
            key={episode.id} 
            className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"
            onClick={() => handleRowClick(episode)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-bold">{episode.number}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">{episode.title}</div>
              <div className="text-xs text-gray-500 truncate max-w-xs" title={episode.url}>
                {episode.url}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <svg 
                  className={`w-5 h-5 mr-2 ${getWatchedStatus(episode.watched)}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {episode.watched ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className={`text-sm ${getWatchedStatus(episode.watched)}`}>
                  {episode.watched ? '已观看' : '未观看'}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => handleCopyUrl(e, episode.url, episode.id)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    copiedId === episode.id 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  title="复制链接"
                >
                  {copiedId === episode.id ? '已复制' : '复制'}
                </button>
                <button
                  onClick={(e) => handleOpenUrl(e, episode.url)}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200"
                  title="打开链接"
                >
                  打开
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
```

**Step 4: 运行TypeScript检查**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 5: 提交**

```bash
git add src/renderer/components/common/VirtualEpisodeList.tsx
git commit -m "fix: adjust virtual list layout for table compatibility"
```

---

### Task 3: 优化虚拟滚动表格结构

**Files:**
- Modify: `src/renderer/components/common/VirtualEpisodeList.tsx`

**Step 1: 简化表格结构，使用div代替table**

问题: 在虚拟滚动中使用完整的table结构会导致布局问题，改用div模拟表格布局

**Step 2: 创建表格头组件**

```tsx
// 在组件顶部添加TableHeader组件
const TableHeader = () => (
  <div className="grid grid-cols-4 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200">
    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      集数
    </div>
    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      标题
    </div>
    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      状态
    </div>
    <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      操作
    </div>
  </div>
);
```

**Step 3: 修改Row组件使用div布局**

```tsx
const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const episode = episodes[index];
  
  return (
    <div 
      style={style}
      key={episode.id} 
      className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
      onClick={() => handleRowClick(episode)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-800 font-bold">{episode.number}</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{episode.title}</div>
        <div className="text-xs text-gray-500 truncate max-w-xs" title={episode.url}>
          {episode.url}
        </div>
      </div>
      <div className="flex items-center">
        <svg 
          className={`w-5 h-5 mr-2 ${getWatchedStatus(episode.watched)}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {episode.watched ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <span className={`text-sm ${getWatchedStatus(episode.watched)}`}>
          {episode.watched ? '已观看' : '未观看'}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={(e) => handleCopyUrl(e, episode.url, episode.id)}
          className={`px-3 py-1 rounded text-xs font-medium ${
            copiedId === episode.id 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
          title="复制链接"
        >
          {copiedId === episode.id ? '已复制' : '复制'}
        </button>
        <button
          onClick={(e) => handleOpenUrl(e, episode.url)}
          className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200"
          title="打开链接"
        >
          打开
        </button>
      </div>
    </div>
  );
};
```

**Step 4: 修改主组件返回结构**

```tsx
if (episodes.length === 0) {
  return (
    <div className={`${className}`}>
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">暂无剧集</h3>
        <p className="mt-1 text-sm text-gray-500">还没有添加任何剧集。</p>
      </div>
    </div>
  );
}

return (
  <div className={`${className}`}>
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <TableHeader />
      <FixedSizeList
        height={height}
        itemCount={episodes.length}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  </div>
);
```

**Step 5: 运行TypeScript检查**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 6: 提交**

```bash
git add src/renderer/components/common/VirtualEpisodeList.tsx
git commit -m "refactor: use grid layout for virtual episode list"
```

---

### Task 4: 添加CSS Grid列宽调整

**Files:**
- Modify: `src/renderer/components/common/VirtualEpisodeList.tsx`

**Step 1: 调整网格列宽比例**

```tsx
// 修改TableHeader组件
const TableHeader = () => (
  <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200">
    <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      集数
    </div>
    <div className="col-span-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      标题
    </div>
    <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      状态
    </div>
    <div className="col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      操作
    </div>
  </div>
);

// 修改Row组件
const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const episode = episodes[index];
  
  return (
    <div 
      style={style}
      key={episode.id} 
      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
      onClick={() => handleRowClick(episode)}
    >
      <div className="col-span-2 flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-800 font-bold">{episode.number}</span>
        </div>
      </div>
      <div className="col-span-5">
        <div className="text-sm font-medium text-gray-900">{episode.title}</div>
        <div className="text-xs text-gray-500 truncate" title={episode.url}>
          {episode.url}
        </div>
      </div>
      <div className="col-span-2 flex items-center">
        <svg 
          className={`w-5 h-5 mr-2 ${getWatchedStatus(episode.watched)}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {episode.watched ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <span className={`text-sm ${getWatchedStatus(episode.watched)}`}>
          {episode.watched ? '已观看' : '未观看'}
        </span>
      </div>
      <div className="col-span-3 flex space-x-2">
        <button
          onClick={(e) => handleCopyUrl(e, episode.url, episode.id)}
          className={`px-3 py-1 rounded text-xs font-medium ${
            copiedId === episode.id 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
          title="复制链接"
        >
          {copiedId === episode.id ? '已复制' : '复制'}
        </button>
        <button
          onClick={(e) => handleOpenUrl(e, episode.url)}
          className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200"
          title="打开链接"
        >
          打开
        </button>
      </div>
    </div>
  );
};
```

**Step 2: 运行TypeScript检查**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 3: 提交**

```bash
git add src/renderer/components/common/VirtualEpisodeList.tsx
git commit -m "feat: adjust grid column widths for better layout"
```

---

### Task 5: 添加组件导出和文档

**Files:**
- Modify: `src/renderer/components/common/index.ts` (如果存在)
- Create: `src/renderer/components/common/VirtualEpisodeList.stories.tsx` (可选)

**Step 1: 检查是否存在导出文件**

运行: `ls src/renderer/components/common/index.ts`
预期: 文件可能存在或不存在

**Step 2: 如果存在index.ts，添加导出**

```typescript
// 在index.ts中添加
export { default as VirtualEpisodeList } from './VirtualEpisodeList';
```

**Step 3: 如果不存在index.ts，创建它**

```typescript
export { default as EpisodeList } from './EpisodeList';
export { default as VirtualEpisodeList } from './VirtualEpisodeList';
```

**Step 4: 运行TypeScript检查**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 5: 提交**

```bash
git add src/renderer/components/common/index.ts
git commit -m "feat: export VirtualEpisodeList component"
```

---

**计划完成并保存到 `docs/plans/2025-02-19-virtual-episode-list.md`。两个执行选项：**

**1. Subagent-Driven (此会话)** - 我为每个任务分派新的子代理，在任务之间进行审查，快速迭代

**2. 并行会话 (单独)** - 使用executing-plans打开新会话，批量执行并设置检查点

**选择哪种方法？**