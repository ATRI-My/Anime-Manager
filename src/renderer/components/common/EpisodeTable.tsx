import React, { useState, useEffect } from 'react';
import { Episode as SharedEpisode } from '../../../shared/types';
import type { EpisodeFormData } from './InlineEpisodeForm';
import InlineEpisodeForm from './InlineEpisodeForm';
import { useTheme, useTranslation } from '../../hooks';

interface EpisodeTableProps {
  episodes: SharedEpisode[];
  onAddEpisode: (formData: EpisodeFormData) => void;
  onEditEpisode: (episodeId: string, formData: EpisodeFormData) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onBulkDeleteEpisodes?: (episodeIds: string[]) => void;
  className?: string;
}

const EpisodeTable: React.FC<EpisodeTableProps> = ({
  episodes,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onBulkDeleteEpisodes,
  className = ''
}) => {
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { isDark, bg, text, border } = useTheme();
  const { t } = useTranslation();

  // 当剧集数据变化时，重置表单状态
  useEffect(() => {
    // 如果正在编辑的剧集被删除，关闭表单
    if (editingEpisodeId && !episodes.find(ep => ep.id === editingEpisodeId)) {
      setShowInlineForm(false);
      setEditingEpisodeId(null);
      setIsAddingNew(false);
    }
  }, [episodes, editingEpisodeId]);

  const handleSelectEpisode = (episodeId: string) => {
    if (selectedEpisodes.includes(episodeId)) {
      setSelectedEpisodes(selectedEpisodes.filter(id => id !== episodeId));
    } else {
      setSelectedEpisodes([...selectedEpisodes, episodeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEpisodes([]);
    } else {
      setSelectedEpisodes(episodes.map(ep => ep.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = () => {
    if (selectedEpisodes.length === 0) {
      return;
    }
    
    // 为避免浏览器原生 confirm/alert 造成 Electron 焦点异常，这里直接执行删除
    if (onBulkDeleteEpisodes) {
      // 使用批量删除函数
      onBulkDeleteEpisodes(selectedEpisodes);
    } else {
      // 回退到逐个删除
      selectedEpisodes.forEach(id => onDeleteEpisode(id));
    }
    setSelectedEpisodes([]);
    setSelectAll(false);
  };

  // 内联表单事件处理
  const handleAddNew = () => {
    setShowInlineForm(true);
    setIsAddingNew(true);
    setEditingEpisodeId(null);
  };

  const handleEdit = (episodeId: string) => {
    setShowInlineForm(true);
    setEditingEpisodeId(episodeId);
    setIsAddingNew(false);
  };

  const handleFormSubmit = (formData: EpisodeFormData) => {
    if (editingEpisodeId) {
      onEditEpisode(editingEpisodeId, formData);
    } else {
      onAddEpisode(formData);
    }
    setShowInlineForm(false);
    setEditingEpisodeId(null);
    setIsAddingNew(false);
  };

  const handleFormCancel = () => {
    setShowInlineForm(false);
    setEditingEpisodeId(null);
    setIsAddingNew(false);
  };

  const handleFormDelete = () => {
    if (editingEpisodeId) {
      onDeleteEpisode(editingEpisodeId);
      setShowInlineForm(false);
      setEditingEpisodeId(null);
      setIsAddingNew(false);
    }
  };

  // 获取编辑剧集的初始数据
  const getEditingEpisodeData = () => {
    if (!editingEpisodeId) return undefined;
    const episode = episodes.find(ep => ep.id === editingEpisodeId);
    if (!episode) return undefined;
    
    return {
      number: episode.number,
      title: episode.title,
      url: episode.url,
      watched: episode.watched,
      notes: episode.notes || ''
    };
  };

  return (
    <div className={`${className}`}>
      {/* 内联表单区域 */}
      {showInlineForm && (
        <div className={`mb-6 p-4 rounded-lg border ${bg.secondary} ${border.primary}`}>
          <h3 className={`text-lg font-medium mb-4 ${text.primary}`}>
            {isAddingNew ? t('episode.addNew') : t('episode.edit')}
          </h3>
          <InlineEpisodeForm
            onSubmit={handleFormSubmit}
            initialData={
              isAddingNew 
                ? {
                    number: episodes.length > 0 ? Math.max(...episodes.map(ep => ep.number)) + 1 : 1,
                    title: '',
                    url: '',
                    watched: false,
                    notes: ''
                  }
                : getEditingEpisodeData()
            }
            onCancel={handleFormCancel}
            onDelete={editingEpisodeId ? handleFormDelete : undefined}
            isEditing={!!editingEpisodeId}
            enableValidation={true}
          />
        </div>
      )}
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'}`}
            />
            <span className={`ml-2 text-sm ${text.secondary}`}>
              {t('episode.selectAll')} ({selectedEpisodes.length}/{episodes.length})
            </span>
          </div>
          
          {selectedEpisodes.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                {t('episode.bulkDelete')}
              </button>
            </div>
          )}
        </div>

        <div className={`text-sm ${text.muted}`}>
          {t('episode.episodeCount', { n: String(episodes.length) })}
        </div>
      </div>

      <div className={`overflow-x-auto rounded-lg border ${border.primary}`}>
        <table className={`min-w-full divide-y ${border.primary}`}>
          <thead className={bg.secondary}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-12 ${text.muted}`}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'}`}
                />
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnNumber')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnTitle')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${text.muted}`}>
                {t('episode.columnLink')}
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
              <tr key={episode.id} className={bg.hover}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEpisodes.includes(episode.id)}
                    onChange={() => handleSelectEpisode(episode.id)}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${text.primary}`}>{t('episode.episodeNumber', { n: String(episode.number) })}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${text.primary}`}>{episode.title}</div>
                </td>
                 <td className="px-6 py-4">
                   <div className={`text-sm truncate max-w-2xl ${text.muted}`}>{episode.url}</div>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${episode.watched ? (isDark ? 'bg-green-800/50 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-neutral-700 text-gray-200' : 'bg-gray-100 text-gray-800')}`}>
                    {episode.watched ? t('episode.watched') : t('episode.unwatched')}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(episode.id)}
                      className={isDark ? 'text-blue-400 hover:text-blue-300 mr-4' : 'text-blue-600 hover:text-blue-900 mr-4'}
                    >
                      {t('episode.editBtn')}
                    </button>
                   <button
                     onClick={() => onDeleteEpisode(episode.id)}
                     className={isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                   >
                     {t('episode.deleteBtn')}
                   </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {episodes.length === 0 && (
        <div className={`text-center py-12 border rounded-lg ${border.primary}`}>
          <svg className={`mx-auto h-12 w-12 ${text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={`mt-2 text-sm font-medium ${text.primary}`}>{t('episode.noEpisodesData')}</h3>
          <p className={`mt-1 text-sm ${text.muted}`}>{t('episode.addEpisodeHint')}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className={`text-sm ${text.muted}`}>
          {t('episode.selectedCount', { n: String(selectedEpisodes.length) })}
        </div>
         <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('episode.addNewRow')}
            </button>
         </div>
      </div>
    </div>
  );
};

export default EpisodeTable;