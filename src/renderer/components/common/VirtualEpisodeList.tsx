import React, { useState } from 'react';
import { List } from 'react-window';
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

  interface RowProps {
    index: number;
    style: React.CSSProperties;
  }

  const Row = ({ index, style }: RowProps) => {
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
       <div className="overflow-x-auto rounded-lg border border-gray-200">
        <TableHeader />
        <List
          rowCount={episodes.length}
          rowHeight={itemHeight}
          style={{ height, width: '100%' }}
          rowComponent={Row}
          rowProps={{} as any}
        />
      </div>
    </div>
  );
};

export default VirtualEpisodeList;