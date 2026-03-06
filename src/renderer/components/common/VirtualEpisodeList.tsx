import React, { useState } from 'react';
import { List } from 'react-window';
import { Episode } from '../../../shared/types';
import { useTheme, useTranslation } from '../../hooks';

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
  const { isDark, bg, text, border } = useTheme();
  const { t } = useTranslation();

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
    <div className={`grid grid-cols-12 gap-4 px-6 py-3 border-b ${bg.secondary} ${border.primary}`}>
      <div className={`col-span-2 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
        {t('episode.columnNumber')}
      </div>
      <div className={`col-span-5 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
        {t('episode.columnTitle')}
      </div>
      <div className={`col-span-2 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
        {t('episode.columnStatus')}
      </div>
      <div className={`col-span-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
        {t('episode.columnAction')}
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
        className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer border-b ${bg.hover} ${border.primary}`}
        onClick={() => handleRowClick(episode)}
      >
        <div className="col-span-2 flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
            <span className={isDark ? 'text-blue-200 font-bold' : 'text-blue-800 font-bold'}>{episode.number}</span>
          </div>
        </div>
        <div className="col-span-5">
          <div className={`text-sm font-medium ${text.primary}`}>{episode.title}</div>
          <div className={`text-xs truncate ${text.muted}`} title={episode.url}>
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
            {episode.watched ? t('episode.watched') : t('episode.unwatched')}
          </span>
        </div>
        <div className="col-span-3 flex space-x-2">
          <button
            onClick={(e) => handleCopyUrl(e, episode.url, episode.id)}
            className={`px-3 py-1 rounded text-xs font-medium ${
              copiedId === episode.id 
                ? isDark ? 'bg-green-800/50 text-green-200' : 'bg-green-100 text-green-800' 
                : isDark ? 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            title={t('episode.copyLinkTitle')}
          >
            {copiedId === episode.id ? t('episode.copied') : t('episode.copy')}
          </button>
          <button
            onClick={(e) => handleOpenUrl(e, episode.url)}
            className={isDark ? 'px-3 py-1 bg-green-800/50 text-green-200 rounded text-xs font-medium hover:bg-green-700/50' : 'px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200'}
            title={t('episode.openLinkTitle')}
          >
            {t('episode.open')}
          </button>
        </div>
      </div>
    );
  };

  if (episodes.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <svg className={`mx-auto h-12 w-12 ${text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`mt-2 text-sm font-medium ${text.primary}`}>{t('episode.noEpisodes')}</h3>
          <p className={`mt-1 text-sm ${text.muted}`}>{t('episode.noEpisodesHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
       <div className={`overflow-x-auto rounded-lg border ${border.primary}`}>
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