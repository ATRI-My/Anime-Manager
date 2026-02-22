# SearchPreview组件实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建SearchPreview组件，实现实时预览匹配的动漫结果，支持高亮显示和键盘导航

**Architecture:** 创建独立的SearchPreview组件，接收搜索关键词和动漫列表，内部处理过滤逻辑，使用HighlightText组件高亮匹配文本，支持键盘导航和点击选择

**Tech Stack:** React, TypeScript, Tailwind CSS, 现有HighlightText组件

---

### Task 1: 创建SearchPreview组件文件

**Files:**
- Create: `src/renderer/components/common/SearchPreview.tsx`

**Step 1: 创建组件文件结构**

```typescript
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import HighlightText from './HighlightText';
import { Anime } from '../../../shared/types';

interface SearchPreviewProps {
  query: string;
  animeList: Anime[];
  maxResults?: number;
  onSelectAnime?: (anime: Anime) => void;
  className?: string;
}

const SearchPreview: React.FC<SearchPreviewProps> = ({
  query,
  animeList,
  maxResults = 10,
  onSelectAnime,
  className = ''
}) => {
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 过滤动漫列表
  useEffect(() => {
    if (!query.trim()) {
      setFilteredAnime([]);
      setSelectedIndex(-1);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = animeList.filter(anime => {
      return (
        anime.title.toLowerCase().includes(lowerQuery) ||
        anime.description?.toLowerCase().includes(lowerQuery) ||
        anime.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }).slice(0, maxResults);

    setFilteredAnime(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
  }, [query, animeList, maxResults]);

  // 键盘导航
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (filteredAnime.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredAnime.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAnime.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredAnime.length) {
          handleSelectAnime(filteredAnime[selectedIndex]);
        }
        break;
      case 'Escape':
        setFilteredAnime([]);
        setSelectedIndex(-1);
        break;
    }
  };

  // 选择动漫
  const handleSelectAnime = (anime: Anime) => {
    if (onSelectAnime) {
      onSelectAnime(anime);
    }
    setFilteredAnime([]);
    setSelectedIndex(-1);
  };

  // 滚动到选中的项
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  if (!query.trim() || filteredAnime.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="py-2">
        {filteredAnime.map((anime, index) => (
          <button
            key={anime.id}
            ref={el => itemRefs.current[index] = el}
            type="button"
            onClick={() => handleSelectAnime(anime)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
              index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900 mb-1">
                <HighlightText
                  text={anime.title}
                  highlight={query}
                  className="text-base"
                  highlightClassName="bg-yellow-200 font-semibold"
                />
              </div>
              {anime.description && (
                <div className="text-sm text-gray-600 mb-1 line-clamp-2">
                  <HighlightText
                    text={anime.description}
                    highlight={query}
                    className="text-sm"
                    highlightClassName="bg-yellow-100"
                  />
                </div>
              )}
              {anime.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {anime.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      <HighlightText
                        text={tag}
                        highlight={query}
                        className="text-xs"
                        highlightClassName="bg-yellow-200"
                      />
                    </span>
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {anime.episodes.length} 集 • {anime.watchMethod}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPreview;
```

**Step 2: 验证文件创建**

运行: `ls src/renderer/components/common/SearchPreview.tsx`
预期: 文件存在

**Step 3: 更新common组件导出**

修改: `src/renderer/components/common/index.ts:11`

```typescript
export { default as EpisodeList } from './EpisodeList';
export { default as VirtualEpisodeList } from './VirtualEpisodeList';
export { default as SearchBar } from './SearchBar';
export { default as SearchPreview } from './SearchPreview';
export { default as ToastContainer } from './ToastContainer';
export { default as Toast } from './Toast';
export { default as FileOperations } from './FileOperations';
export { default as ToolConfigForm } from './ToolConfigForm';
export { default as EpisodeTable } from './EpisodeTable';
export { default as AnimeForm } from './AnimeForm';
export { default as AnimeCard } from './AnimeCard';
export { default as HighlightText } from './HighlightText';
```

**Step 4: 验证导出更新**

运行: `cat src/renderer/components/common/index.ts | grep SearchPreview`
预期: 包含 `export { default as SearchPreview } from './SearchPreview';`

**Step 5: 创建测试文件**

创建: `test-search-preview.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchPreview from '../src/renderer/components/common/SearchPreview';
import { Anime } from '../src/shared/types';

// 测试数据
const mockAnimeList: Anime[] = [
  {
    id: '1',
    title: '进击的巨人',
    watchMethod: '在线观看',
    description: '人类与巨人的战斗',
    tags: ['热血', '战斗', '悬疑'],
    episodes: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: '鬼灭之刃',
    watchMethod: '下载观看',
    description: '鬼杀队的故事',
    tags: ['战斗', '奇幻', '成长'],
    episodes: [],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: '3',
    title: '咒术回战',
    watchMethod: '在线观看',
    description: '咒术师的故事',
    tags: ['战斗', '校园', '超能力'],
    episodes: [],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  }
];

describe('SearchPreview', () => {
  test('空查询时不显示', () => {
    render(
      <SearchPreview 
        query=""
        animeList={mockAnimeList}
      />
    );
    
    expect(screen.queryByText('进击的巨人')).not.toBeInTheDocument();
  });

  test('匹配查询时显示结果', () => {
    render(
      <SearchPreview 
        query="巨人"
        animeList={mockAnimeList}
      />
    );
    
    expect(screen.getByText('进击的巨人')).toBeInTheDocument();
    expect(screen.queryByText('鬼灭之刃')).not.toBeInTheDocument();
  });

  test('点击选择触发回调', () => {
    const handleSelect = jest.fn();
    
    render(
      <SearchPreview 
        query="巨人"
        animeList={mockAnimeList}
        onSelectAnime={handleSelect}
      />
    );
    
    fireEvent.click(screen.getByText('进击的巨人'));
    expect(handleSelect).toHaveBeenCalledWith(mockAnimeList[0]);
  });

  test('支持键盘导航', () => {
    const handleSelect = jest.fn();
    
    render(
      <SearchPreview 
        query="战斗"
        animeList={mockAnimeList}
        onSelectAnime={handleSelect}
      />
    );
    
    const container = screen.getByRole('list');
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'Enter' });
    
    expect(handleSelect).toHaveBeenCalled();
  });

  test('限制最大显示结果', () => {
    render(
      <SearchPreview 
        query="战斗"
        animeList={mockAnimeList}
        maxResults={1}
      />
    );
    
    const results = screen.getAllByRole('button');
    expect(results.length).toBe(1);
  });
});
```

**Step 6: 验证测试文件**

运行: `ls test-search-preview.tsx`
预期: 文件存在

**Step 7: 创建演示页面**

创建: `search-preview-demo.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SearchPreview 演示</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body class="p-8 bg-gray-50">
    <div id="root" class="max-w-2xl mx-auto"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        // HighlightText 组件
        const HighlightText = ({ text, highlight, className = '', highlightClassName = 'bg-yellow-200' }) => {
            if (!highlight.trim()) {
                return React.createElement('span', { className }, text);
            }
            
            const escapeRegExp = (string) => {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            };
            
            const escapedHighlight = escapeRegExp(highlight);
            const regex = new RegExp(`(${escapedHighlight})`, 'gi');
            const parts = text.split(regex);
            
            return React.createElement('span', { className },
                parts.map((part, index) => {
                    const isHighlight = regex.test(part);
                    regex.lastIndex = 0;
                    
                    return isHighlight 
                        ? React.createElement('span', { 
                            key: index, 
                            className: highlightClassName 
                          }, part)
                        : React.createElement('span', { key: index }, part);
                })
            );
        };
        
        // SearchPreview 组件
        const SearchPreview = ({ query, animeList, maxResults = 10, onSelectAnime, className = '' }) => {
            const [filteredAnime, setFilteredAnime] = useState([]);
            const [selectedIndex, setSelectedIndex] = useState(-1);
            const containerRef = useRef(null);
            const itemRefs = useRef([]);
            
            // 过滤动漫列表
            useEffect(() => {
                if (!query.trim()) {
                    setFilteredAnime([]);
                    setSelectedIndex(-1);
                    return;
                }
                
                const lowerQuery = query.toLowerCase();
                const filtered = animeList.filter(anime => {
                    return (
                        anime.title.toLowerCase().includes(lowerQuery) ||
                        anime.description?.toLowerCase().includes(lowerQuery) ||
                        anime.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                    );
                }).slice(0, maxResults);
                
                setFilteredAnime(filtered);
                setSelectedIndex(filtered.length > 0 ? 0 : -1);
            }, [query, animeList, maxResults]);
            
            // 键盘导航
            const handleKeyDown = (e) => {
                if (filteredAnime.length === 0) return;
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        setSelectedIndex(prev => 
                            prev < filteredAnime.length - 1 ? prev + 1 : 0
                        );
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        setSelectedIndex(prev => 
                            prev > 0 ? prev - 1 : filteredAnime.length - 1
                        );
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (selectedIndex >= 0 && selectedIndex < filteredAnime.length) {
                            handleSelectAnime(filteredAnime[selectedIndex]);
                        }
                        break;
                    case 'Escape':
                        setFilteredAnime([]);
                        setSelectedIndex(-1);
                        break;
                }
            };
            
            // 选择动漫
            const handleSelectAnime = (anime) => {
                if (onSelectAnime) {
                    onSelectAnime(anime);
                }
                setFilteredAnime([]);
                setSelectedIndex(-1);
            };
            
            // 滚动到选中的项
            useEffect(() => {
                if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
                    itemRefs.current[selectedIndex]?.scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }
            }, [selectedIndex]);
            
            if (!query.trim() || filteredAnime.length === 0) {
                return null;
            }
            
            return React.createElement('div', {
                ref: containerRef,
                className: `absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto ${className}`,
                onKeyDown: handleKeyDown,
                tabIndex: 0
            },
                React.createElement('div', { className: 'py-2' },
                    filteredAnime.map((anime, index) => 
                        React.createElement('button', {
                            key: anime.id,
                            ref: el => itemRefs.current[index] = el,
                            type: 'button',
                            onClick: () => handleSelectAnime(anime),
                            className: `w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                                index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`
                        },
                            React.createElement('div', { className: 'flex flex-col' },
                                React.createElement('div', { className: 'font-medium text-gray-900 mb-1' },
                                    React.createElement(HighlightText, {
                                        text: anime.title,
                                        highlight: query,
                                        className: 'text-base',
                                        highlightClassName: 'bg-yellow-200 font-semibold'
                                    })
                                ),
                                anime.description && React.createElement('div', { className: 'text-sm text-gray-600 mb-1 line-clamp-2' },
                                    React.createElement(HighlightText, {
                                        text: anime.description,
                                        highlight: query,
                                        className: 'text-sm',
                                        highlightClassName: 'bg-yellow-100'
                                    })
                                ),
                                anime.tags.length > 0 && React.createElement('div', { className: 'flex flex-wrap gap-1 mt-1' },
                                    anime.tags.map(tag => 
                                        React.createElement('span', { 
                                            key: tag, 
                                            className: 'px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded'
                                        },
                                            React.createElement(HighlightText, {
                                                text: tag,
                                                highlight: query,
                                                className: 'text-xs',
                                                highlightClassName: 'bg-yellow-200'
                                            })
                                        )
                                    )
                                ),
                                React.createElement('div', { className: 'text-xs text-gray-500 mt-2' },
                                    `${anime.episodes.length} 集 • ${anime.watchMethod}`
                                )
                            )
                        )
                    )
                )
            );
        };
        
        // 演示组件
        const DemoApp = () => {
            const [query, setQuery] = useState('');
            const [selectedAnime, setSelectedAnime] = useState(null);
            
            const mockAnimeList = [
                {
                    id: '1',
                    title: '进击的巨人',
                    watchMethod: '在线观看',
                    description: '人类与巨人的战斗，墙内人类为生存而战的故事',
                    tags: ['热血', '战斗', '悬疑', '黑暗'],
                    episodes: Array(75).fill().map((_, i) => ({ id: `${i+1}`, number: i+1 })),
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01'
                },
                {
                    id: '2',
                    title: '鬼灭之刃',
                    watchMethod: '下载观看',
                    description: '灶门炭治郎为拯救变成鬼的妹妹而加入鬼杀队',
                    tags: ['战斗', '奇幻', '成长', '亲情'],
                    episodes: Array(55).fill().map((_, i) => ({ id: `${i+1}`, number: i+1 })),
                    createdAt: '2024-01-02',
                    updatedAt: '2024-01-02'
                },
                {
                    id: '3',
                    title: '咒术回战',
                    watchMethod: '在线观看',
                    description: '高中生虎杖悠仁吞下特级咒物后成为咒术师',
                    tags: ['战斗', '校园', '超能力', '黑暗'],
                    episodes: Array(47).fill().map((_, i) => ({ id: `${i+1}`, number: i+1 })),
                    createdAt: '2024-01-03',
                    updatedAt: '2024-01-03'
                },
                {
                    id: '4',
                    title: '间谍过家家',
                    watchMethod: '在线观看',
                    description: '间谍、杀手和超能力者组成的伪装家庭',
                    tags: ['喜剧', '家庭', '间谍', '温馨'],
                    episodes: Array(37).fill().map((_, i) => ({ id: `${i+1}`, number: i+1 })),
                    createdAt: '2024-01-04',
                    updatedAt: '2024-01-04'
                },
                {
                    id: '5',
                    title: '孤独摇滚！',
                    watchMethod: '下载观看',
                    description: '社交恐惧症少女组建乐队的故事',
                    tags: ['音乐', '校园', '喜剧', '成长'],
                    episodes: Array(12).fill().map((_, i) => ({ id: `${i+1}`, number: i+1 })),
                    createdAt: '2024-01-05',
                    updatedAt: '2024-01-05'
                }
            ];
            
            const handleSelectAnime = (anime) => {
                setSelectedAnime(anime);
                setQuery('');
            };
            
            return React.createElement('div', { className: 'space-y-8' },
                React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
                    React.createElement('h1', { className: 'text-2xl font-bold text-gray-800 mb-4' }, 'SearchPreview 组件演示'),
                    React.createElement('p', { className: 'text-gray-600 mb-6' }, '输入关键词搜索动漫，支持标题、描述和标签搜索，使用键盘上下箭头导航，回车或点击选择')
                ),
                
                React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
                    React.createElement('h2', { className: 'text-xl font-semibold text-gray-700 mb-4' }, '搜索演示'),
                    React.createElement('div', { className: 'relative' },
                        React.createElement('input', {
                            type: 'text',
                            value: query,
                            onChange: (e) => setQuery(e.target.value),
                            placeholder: '输入动漫标题、描述或标签...',
                            className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            autoFocus: true
                        }),
                        React.createElement(SearchPreview, {
                            query: query,
                            animeList: mockAnimeList,
                            onSelectAnime: handleSelectAnime,
                            className: 'mt-1'
                        })
                    ),
                    React.createElement('div', { className: 'mt-4 text-sm text-gray-500' },
                        '提示：使用 ↑ ↓ 箭头导航，Enter 选择，Esc 关闭'
                    )
                ),
                
                selectedAnime && React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
                    React.createElement('h2', { className: 'text-xl font-semibold text-gray-700 mb-4' }, '已选择的动漫'),
                    React.createElement('div', { className: 'p-4 bg-blue-50 rounded-lg' },
                        React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, selectedAnime.title),
                        React.createElement('p', { className: 'text-gray-600 mb-3' }, selectedAnime.description),
                        React.createElement('div', { className: 'flex flex-wrap gap-2 mb-3' },
                            selectedAnime.tags.map(tag => 
                                React.createElement('span', { 
                                    key: tag, 
                                    className: 'px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full'
                                }, tag)
                            )
                        ),
                        React.createElement('div', { className: 'text-sm text-gray-500' },
                            `观看方式：${selectedAnime.watchMethod} • 剧集数：${selectedAnime.episodes.length}`
                        )
                    )
                ),
                
                React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
                    React.createElement('h2', { className: 'text-xl font-semibold text-gray-700 mb-4' }, '功能说明'),
                    React.createElement('ul', { className: 'space-y-2 text-gray-600' },
                        React.createElement('li', null, '✅ 实时搜索预览：输入时即时显示匹配结果'),
                        React.createElement('li', null, '✅ 多字段搜索：支持标题、描述、标签搜索'),
                        React.createElement('li', null, '✅ 文本高亮：使用HighlightText组件高亮匹配文本'),
                        React.createElement('li', null, '✅ 键盘导航：支持上下箭头选择和回车确认'),
                        React.createElement('li', null, '✅ 点击选择：点击结果项选择动漫'),
                        React.createElement('li', null, '✅ 结果限制：可配置最大显示结果数'),
                        React.createElement('li', null, '✅ 空状态处理：无结果时不显示组件'),
                        React.createElement('li', null, '✅ 响应式设计：使用Tailwind CSS样式')
                    )
                )
            );
        };
        
        ReactDOM.render(React.createElement(DemoApp), document.getElementById('root'));
    </script>
</body>
</html>
```

**Step 8: 验证演示页面**

运行: `ls search-preview-demo.html`
预期: 文件存在

**Step 9: 运行类型检查**

运行: `npx tsc --noEmit`
预期: 无类型错误

**Step 10: 提交更改**

```bash
git add src/renderer/components/common/SearchPreview.tsx
git add src/renderer/components/common/index.ts
git add test-search-preview.tsx
git add search-preview-demo.html
git commit -m "feat: add SearchPreview component with real-time preview, keyboard navigation, and highlighting"
```

---

计划完成并保存到 `docs/plans/2025-02-19-search-preview-implementation.md`。两个执行选项：

**1. 子代理驱动（本次会话）** - 我分派新的子代理执行每个任务，任务间进行代码审查，快速迭代

**2. 并行会话（独立）** - 在新会话中使用executing-plans，批量执行并设置检查点

您选择哪种方法？