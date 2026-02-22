import React, { useState } from 'react';
import { Anime } from '../../../shared/types';

interface AnimeCardProps {
  anime: Anime;
  onSelect?: (anime: Anime) => void;
  onEdit?: (anime: Anime) => void;
  onDelete?: (anime: Anime) => void;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);

  const getWatchMethodColor = (method: string) => {
    switch (method) {
      case '在线观看': return 'bg-blue-100 text-blue-800';
      case '下载观看': return 'bg-green-100 text-green-800';
      case '本地文件': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(anime);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(anime);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(anime);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{anime.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getWatchMethodColor(anime.watchMethod)}`}>
                {anime.watchMethod}
              </span>
              <span className="text-sm text-gray-500">
                {anime.episodes.length} 集
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="编辑"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1 text-gray-400 hover:text-red-600"
                title="删除"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {anime.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{anime.description}</p>
        )}
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>创建: {anime.createdAt}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>更新: {anime.updatedAt}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          {anime.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          onClick={handleExpandClick}
        >
          {expanded ? '收起详情' : '查看详情'}
          <svg className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="text-xs text-gray-500">
          点击卡片查看剧集
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;