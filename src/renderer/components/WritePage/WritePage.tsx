import React, { useState, useEffect, useMemo } from 'react';
import FileOperations from '../common/FileOperations';
import AnimeForm from '../common/AnimeForm';
import EpisodeTable from '../common/EpisodeTable';
import FormValidation from '../common/FormValidation';
import { UnsavedChangesBanner } from '../common';
import { useAppDataContext, useToast, useUnsavedChangesGuard, useTranslation } from '../../hooks';
import type { TranslationKey } from '../../i18n/translations';
import { Anime } from '../../../shared/types';
import { validateAnime } from '../../../shared/validation';
import type { EpisodeFormData } from '../common/InlineEpisodeForm';
import toast from '../../utils/toast';

interface AnimeFormData {
  title: string;
  watchMethod: string;
  description: string;
  tags: string[];
  episodes?: any[]; // 可选，因为验证时需要
}

const WritePage: React.FC = () => {
  const { state, actions } = useAppDataContext();
  const { addToast } = useToast();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const selectedAnime = useMemo(() => {
    return state.animeList.find(a => a.id === selectedAnimeId);
  }, [state.animeList, selectedAnimeId]);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const theme = state.settings?.theme || 'light';
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  // 处理文件操作 - 通过 FileOperations 组件处理

  // 处理番剧操作
  const handleAddAnime = () => {
    setIsEditing(true);
    setSelectedAnimeId(null);
  };

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnimeId(anime.id);
    setIsEditing(false);
  };

  const handleSaveAnime = async (formData: AnimeFormData) => {
    // 清空之前的错误
    setValidationErrors([]);
    
    // 准备完整的动漫数据用于验证
    const animeData = {
      id: selectedAnime?.id || `anime-${Date.now()}`,
      title: formData.title || '',
      watchMethod: formData.watchMethod || '',
      description: formData.description || '',
      tags: formData.tags || [],
      episodes: selectedAnime?.episodes || [],
      createdAt: selectedAnime?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 验证数据
    const validationResult = validateAnime(animeData);
    
    if (!validationResult.isValid) {
      const errorKeyMap: Record<string, TranslationKey> = {
        'id不能为空': 'anime.validation.idRequired',
        '标题不能为空': 'anime.validation.titleRequired',
        'watchMethod是必填字段': 'anime.validation.watchMethodRequiredField',
        'tags必须是数组': 'anime.validation.tagsMustBeArray',
        'episodes必须是数组': 'anime.validation.episodesMustBeArray',
        'createdAt是必填字段': 'anime.validation.dateRequired',
        'updatedAt是必填字段': 'anime.validation.dateRequired',
      };
      const translated = validationResult.errors.map((err) => {
        if (err.startsWith('episodes包含无效数据')) return t('anime.validation.episodesInvalid');
        return errorKeyMap[err] ? t(errorKeyMap[err]) : err;
      });
      setValidationErrors(translated);
      console.error('表单验证失败:', validationResult.errors);
      return; // 阻止保存
    }
    
    try {
      if (selectedAnimeId) {
        // 更新现有番剧
        const result = await actions.updateAnime(selectedAnimeId, formData);
        if (result.success) {
          addToast('success', t('write.editAnime'), t('write.toast.updateAnime'));
        } else {
          addToast('error', t('write.toast.updateAnimeFailed'), result.error || '');
        }
      } else {
        const animeToAdd = {
          ...formData,
          episodes: []
        };
        const result = await actions.addAnime(animeToAdd);
        if (result.success) {
          addToast('success', t('write.addAnime'), `"${formData.title}" ${t('write.toast.addAnime')}`);
        } else {
          addToast('error', t('write.toast.addAnimeFailed'), result.error || '');
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('保存番剧失败:', error);
      addToast('error', t('write.toast.saveFileFailed'), error instanceof Error ? error.message : '');
    }
  };

  const handleDeleteAnime = async (animeId: string) => {
    try {
      const result = await actions.deleteAnime(animeId);
      if (result.success) {
        addToast('success', t('anime.deleteAnime'), t('write.toast.deleteAnime'));
        if (selectedAnimeId === animeId) {
          setSelectedAnimeId(null);
        }
      } else {
        addToast('error', t('write.toast.deleteAnimeFailed'), result.error || '');
      }
    } catch (error) {
      console.error('删除番剧失败:', error);
      addToast('error', t('write.toast.deleteAnimeFailed'), error instanceof Error ? error.message : '');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedAnimeId(null);
  };

  // 保存文件处理函数
  const handleSaveFile = async () => {
    try {
      const result = await actions.saveFile();
      if (result.success) {
        addToast('success', t('file.save'), t('write.toast.saveFile'));
      } else {
        addToast('error', t('write.toast.saveFileFailed'), result.error || '');
      }
    } catch (error) {
      console.error('保存文件失败:', error);
      addToast('error', t('write.toast.saveFileFailed'), error instanceof Error ? error.message : '');
    }
  };

  // 处理剧集操作 - 内联表单版本
  const handleAddEpisode = async (formData: EpisodeFormData) => {
    try {
      if (!selectedAnimeId) {
        addToast('error', t('episode.addNew'), t('write.toast.selectAnimeFirst'));
        return;
      }
      if (!selectedAnime) {
        addToast('error', t('episode.addNew'), t('write.toast.animeNotFound'));
        setSelectedAnimeId(null);
        return;
      }
      const result = await actions.addEpisode(selectedAnimeId, formData);
      if (result.success) {
        addToast('success', t('episode.addNew'), t('write.toast.addEpisode'));
        toast.info(t('write.toast.savedToMemory'), t('write.toast.clickSaveToFile'), 5000);
      } else {
        addToast('error', t('write.toast.addEpisodeFailed'), result.error || '');
      }
    } catch (error) {
      console.error('添加剧集失败:', error);
      addToast('error', t('write.toast.addEpisodeFailed'), error instanceof Error ? error.message : '');
    }
  };

  const handleEditEpisode = async (episodeId: string, formData: EpisodeFormData) => {
    if (!selectedAnimeId) return;
    
    try {
      // 直接更新剧集，不再打开模态框
      const result = await actions.updateEpisode(selectedAnimeId, episodeId, formData);
      if (result.success) {
        addToast('success', t('episode.edit'), t('write.toast.updateEpisode'));
        toast.info(t('write.toast.savedToMemory'), t('write.toast.clickSaveToFile'), 5000);
      } else {
        addToast('error', t('write.toast.updateEpisodeFailed'), result.error || '');
      }
    } catch (error) {
      console.error('更新剧集失败:', error);
      addToast('error', t('write.toast.updateEpisodeFailed'), error instanceof Error ? error.message : '');
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedAnimeId) return;
    
    const episode = selectedAnime?.episodes.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    try {
      const result = await actions.deleteEpisode(selectedAnimeId, episodeId);
      
      if (result.success) {
        addToast('success', t('episode.delete'), t('write.toast.deleteEpisode'));
        if (result.updatedAnime) {
          setSelectedAnimeId(result.updatedAnime.id);
        }
      } else {
        addToast('error', t('write.toast.deleteEpisodeFailed'), result.error || '');
      }
    } catch (error) {
      console.error('删除剧集失败:', error);
      addToast('error', t('write.toast.deleteEpisodeFailed'), error instanceof Error ? error.message : '');
    }
  };




  // 处理批量删除剧集
  const handleBulkDeleteEpisodes = async (episodeIds: string[]) => {
    if (!selectedAnimeId || episodeIds.length === 0) return;
    
    try {
      // 不再需要手动更新selectedAnime，依赖全局状态自动更新
      
      // 更新全局状态 - 使用deleteEpisode逐个删除以确保一致性
      let allSuccess = true;
      for (const episodeId of episodeIds) {
        const result = await actions.deleteEpisode(selectedAnimeId, episodeId);
        if (!result.success) {
          allSuccess = false;
          console.error(`删除剧集 ${episodeId} 失败:`, result.error);
        }
      }
      
      if (allSuccess) {
        addToast('success', t('episode.bulkDelete'), t('write.toast.bulkDeleteEpisode'));
        toast.info(t('write.toast.savedToMemory'), t('write.toast.clickSaveToFile'), 5000);
      } else {
        addToast('error', t('write.toast.bulkDeleteEpisodeFailed'), '');
      }
    } catch (error) {
      console.error('批量删除剧集失败:', error);
      addToast('error', t('write.toast.bulkDeleteEpisodeFailed'), error instanceof Error ? error.message : '');
    }
  };



  // 当打开新文件时，重置selectedAnimeId
  useEffect(() => {
    if (state.currentFilePath && selectedAnimeId) {
      // 检查选中的动漫是否存在于新文件中
      const existsInNewFile = state.animeList.some(a => a.id === selectedAnimeId);
      if (!existsInNewFile) {
        setSelectedAnimeId(null);
      }
    }
  }, [state.currentFilePath, state.animeList, selectedAnimeId]);

  // 页面切换保护
  useUnsavedChangesGuard({
    isModified: state.isModified,
    onConfirmNavigation: () => {
      return window.confirm(t('write.confirmLeave'));
    }
  });

  return (
    <div className="flex flex-col h-full p-6">
      {/* 未保存修改提示横幅 */}
      <UnsavedChangesBanner
        isModified={state.isModified}
        onSave={handleSaveFile}
      />
      
      {/* 顶部：文件操作工具栏 */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('write.title')}</h2>
        <FileOperations />
      </div>

      {/* 主内容区：左右分栏 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：番剧列表 */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg shadow p-6 h-full ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('write.animeList')}</h3>
              <button
                onClick={handleAddAnime}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {t('write.addAnime')}
              </button>
            </div>
            
            <div className={`flex-1 overflow-y-auto border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              {state.animeList.length === 0 ? (
                <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('write.noAnimeData')}
                </div>
              ) : (
                <ul className={`divide-y ${isDark ? 'divide-gray-600' : 'divide-gray-200'}`}>
                  {state.animeList.map((anime) => (
                     <li
                      key={anime.id}
                      className={`p-3 cursor-pointer ${
                        isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'
                      } ${
                        selectedAnimeId === anime.id 
                          ? isDark 
                            ? 'bg-blue-900/30 border-l-4 border-blue-400' 
                            : 'bg-blue-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                      onClick={() => handleSelectAnime(anime)}
                    >
                      <div className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{anime.title}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('write.episodesCount', { n: String(anime.episodes.length) })} • {t(('watchMethod.' + anime.watchMethod) as any)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 番剧表单 */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
             <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
               {isEditing ? t('write.addAnime') : selectedAnimeId ? t('write.editAnime') : t('write.selectOrAdd')}
             </h3>
            
            {/* 显示WritePage层面的验证错误 */}
            {validationErrors.length > 0 && (
              <div className="mb-4">
                <FormValidation errors={validationErrors} />
              </div>
            )}
            
            {(isEditing || selectedAnime) ? (
              <AnimeForm
                onSubmit={handleSaveAnime}
                initialData={selectedAnime || { __isNew: true }}
                onCancel={handleCancelEdit}
                 onDelete={selectedAnimeId ? () => handleDeleteAnime(selectedAnimeId) : undefined}
              />
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('write.noAnimeHint')}
              </div>
            )}
          </div>

           {/* 剧集表格 */}
          {selectedAnimeId && selectedAnime && (
            <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('write.episodeManage')}</h3>
              <EpisodeTable
                episodes={selectedAnime.episodes}
                onAddEpisode={handleAddEpisode}
                onEditEpisode={handleEditEpisode}
                onDeleteEpisode={handleDeleteEpisode}
                onBulkDeleteEpisodes={handleBulkDeleteEpisodes}
              />
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default WritePage;