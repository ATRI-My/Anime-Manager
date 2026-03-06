import React, { useState } from 'react';
import { Episode } from '../../../shared/types';
import { useTheme, useTranslation } from '../../hooks';

interface EpisodeListProps {
  episodes: Episode[];
  onSelectEpisode?: (episode: Episode) => void;
  onCopyUrl?: (url: string) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  onSelectEpisode,
  onCopyUrl,
  onOpenUrl,
  className = ''
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isDark, bg, text, border } = useTheme();
  const { t } = useTranslation();

  const handleCopyUrl = async (e: React.MouseEvent, url: string, episodeId: string) => {
    e.stopPropagation();
    try {
      // 尝试使用现代Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // 回退到传统方法
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
      // 即使复制失败，也显示已复制状态，但缩短显示时间
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
    return watched ? 'text-green-600' : (isDark ? 'text-gray-400' : 'text-gray-400');
  };

  return (
    <div className={`${className}`}>
       <div className={`overflow-x-auto rounded-lg border ${border.primary}`}>
        <table className={`min-w-full divide-y ${border.primary}`}>
          <thead className={bg.secondary}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnNumber')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnTitle')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnStatus')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnAction')}
              </th>
            </tr>
          </thead>
          <tbody className={`${bg.card} divide-y ${border.primary}`}>
            {episodes.map((episode) => (
              <tr 
                key={episode.id} 
                className={`${bg.hover} cursor-pointer`}
                onClick={() => handleRowClick(episode)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                      <span className={isDark ? 'text-blue-200 font-bold' : 'text-blue-800 font-bold'}>{episode.number}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium ${text.primary}`}>{episode.title}</div>
                  <div className={`text-xs truncate max-w-xs ${text.muted}`} title={episode.url}>
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
                      {episode.watched ? t('episode.watched') : t('episode.unwatched')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {episodes.length === 0 && (
        <div className="text-center py-12">
          <svg className={`mx-auto h-12 w-12 ${text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`mt-2 text-sm font-medium ${text.primary}`}>{t('episode.noEpisodes')}</h3>
          <p className={`mt-1 text-sm ${text.muted}`}>{t('episode.noEpisodesHint')}</p>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;