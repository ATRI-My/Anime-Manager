import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import AnimeCard from '../common/AnimeCard';
import EpisodeList from '../common/EpisodeList';
import VirtualAnimeGrid from '../common/VirtualAnimeGrid';
import VirtualEpisodeList from '../common/VirtualEpisodeList';
import { useAppDataContext } from '../../contexts/AppDataContext';
import { useToast } from '../../contexts/ToastContext';
import { useVirtualScrollConfig } from '../../hooks/useVirtualScrollConfig';
import { fuzzySearch } from '../../../shared/utils';
import { Anime, Episode } from '../../../shared/types';

interface QueryPageProps {
  className?: string;
}

const QueryPage: React.FC<QueryPageProps> = ({ className = '' }) => {
  const { state } = useAppDataContext();
  const { addToast } = useToast();
  const { animeList, loading, error } = state;
  const virtualScroll = useVirtualScrollConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  // 模糊搜索过滤
  const filteredAnimeList = useMemo(() => {
    return fuzzySearch(searchQuery, animeList);
  }, [searchQuery, animeList]);

  // 获取建议列表（动漫标题）
  const suggestions = useMemo(() => {
    return animeList.map(anime => anime.title);
  }, [animeList]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理建议选择
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  // 处理动漫选择
  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  // 查询页：只用于查看动漫和剧集详情，不提供编辑/删除动漫功能

  // 处理剧集选择
  const handleSelectEpisode = (episode: Episode) => {
    console.log('选择剧集:', episode);
  };

  // 处理复制链接
  const handleCopyUrl = (url: string) => {
    console.log('复制链接:', url);
    // 这里可以添加Toast反馈，但EpisodeList组件已经有视觉反馈了
  };

  // 处理打开链接
  const handleOpenUrl = async (url: string) => {
    try {
      if (state.settings?.toolConfig) {
        const result = await (window as any).electronAPI.openWithTool(url, state.settings.toolConfig);
        if (result.success) {
          addToast('success', '打开链接', '链接已成功打开');
        } else {
          addToast('error', '打开链接失败', result.error || '未知错误');
        }
      } else {
        // 如果没有工具配置，使用默认浏览器
        const result = await (window as any).electronAPI.openWithTool(url, {
          useCustomTool: false,
          customTool: { name: '', path: '', arguments: '' }
        });
        if (result.success) {
          addToast('success', '打开链接', '链接已使用默认浏览器打开');
        } else {
          addToast('error', '打开链接失败', result.error || '未知错误');
        }
      }
    } catch (err) {
      console.error('打开链接失败:', err);
      addToast('error', '打开链接失败', err instanceof Error ? err.message : '未知错误');
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">加载失败</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">动漫查询</h2>
        <p className="text-gray-600 mb-6">搜索和浏览您的动漫资源</p>
        
        <div className="mb-8">
          <SearchBar 
            placeholder="搜索动漫名称、标签或描述..."
            onSearch={handleSearch}
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">动漫列表</h3>
          <div className="text-sm text-gray-500">
            共 {filteredAnimeList.length} 部动漫
          </div>
        </div>
        
        {filteredAnimeList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无动漫</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? '没有找到匹配的动漫' : '还没有添加任何动漫'}
            </p>
          </div>
        ) : virtualScroll.shouldVirtualizeAnimeGrid(filteredAnimeList.length) ? (
          <div className="h-[600px]">
            <VirtualAnimeGrid
              animeList={filteredAnimeList}
              onSelect={handleSelectAnime}
              className="rounded-lg border border-gray-200"
              {...virtualScroll.getAnimeGridProps()}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimeList.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onSelect={handleSelectAnime}
              />
            ))}
          </div>
        )}
      </div>

      {selectedAnime && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedAnime.title} - 剧集列表
            </h3>
            <button
              onClick={() => setSelectedAnime(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {virtualScroll.shouldVirtualizeEpisodeList(selectedAnime.episodes.length) ? (
            <VirtualEpisodeList
              episodes={selectedAnime.episodes}
              onSelectEpisode={handleSelectEpisode}
              onCopyUrl={handleCopyUrl}
              onOpenUrl={handleOpenUrl}
              {...virtualScroll.getEpisodeListProps()}
            />
          ) : (
            <EpisodeList
              episodes={selectedAnime.episodes}
              onSelectEpisode={handleSelectEpisode}
              onCopyUrl={handleCopyUrl}
              onOpenUrl={handleOpenUrl}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QueryPage;