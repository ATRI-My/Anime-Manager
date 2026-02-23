import React, { useState, useEffect } from 'react';
import FileOperations from '../common/FileOperations';
import AnimeForm from '../common/AnimeForm';
import EpisodeTable from '../common/EpisodeTable';
import EpisodeModal from '../common/EpisodeModal';
import FormValidation from '../common/FormValidation';
import { UnsavedChangesBanner } from '../common';
import { useAppDataContext, useToast, useUnsavedChangesGuard } from '../../hooks';
import { Anime, Episode } from '../../../shared/types';
import { validateAnime } from '../../../shared/validation';
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
  const selectedAnime = state.animeList.find(a => a.id === selectedAnimeId);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // 剧集编辑相关状态
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

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
      // 验证失败，显示错误
      setValidationErrors(validationResult.errors);
      console.error('表单验证失败:', validationResult.errors);
      return; // 阻止保存
    }
    
    try {
      if (selectedAnime) {
        // 更新现有番剧
        const result = await actions.updateAnime(selectedAnime.id, formData);
        if (result.success) {
          addToast('success', '更新番剧', '番剧信息更新成功');
        } else {
          addToast('error', '更新番剧失败', result.error || '未知错误');
        }
      } else {
        // 添加新番剧 - 需要确保包含episodes字段
        const animeToAdd = {
          ...formData,
          episodes: [] // 新番剧默认没有剧集
        };
        const result = await actions.addAnime(animeToAdd);
        if (result.success) {
          addToast('success', '添加番剧', `"${formData.title}" 添加成功`);
        } else {
          addToast('error', '添加番剧失败', result.error || '未知错误');
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('保存番剧失败:', error);
      addToast('error', '保存番剧失败', error instanceof Error ? error.message : '未知错误');
    }
  };

  const handleDeleteAnime = async (animeId: string) => {
    try {
      const result = await actions.deleteAnime(animeId);
      if (result.success) {
        addToast('success', '删除番剧', '番剧删除成功');
        if (selectedAnime?.id === animeId) {
          setSelectedAnimeId(null);
        }
      } else {
        addToast('error', '删除番剧失败', result.error || '未知错误');
      }
    } catch (error) {
      console.error('删除番剧失败:', error);
      addToast('error', '删除番剧失败', error instanceof Error ? error.message : '未知错误');
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
        addToast('success', '保存文件', '文件保存成功');
      } else {
        addToast('error', '保存文件失败', result.error || '未知错误');
      }
    } catch (error) {
      console.error('保存文件失败:', error);
      addToast('error', '保存文件失败', error instanceof Error ? error.message : '未知错误');
    }
  };

  // 处理剧集操作
  const handleAddEpisode = () => {
    if (!selectedAnimeId) {
      addToast('error', '无法添加剧集', '请先选择一个番剧');
      return;
    }
    
    setEditingEpisode(null);
    setIsEpisodeModalOpen(true);
  };

  const handleEditEpisode = (episodeId: string) => {
    if (!selectedAnime) return;
    const episode = selectedAnime.episodes.find(ep => ep.id === episodeId);
    if (episode) {
      setEditingEpisode(episode);
      setIsEpisodeModalOpen(true);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedAnime) return;
    
    const episode = selectedAnime.episodes.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    if (confirm(`确定要删除剧集 "${episode.title}" 吗？`)) {
      try {
        const result = await actions.deleteEpisode(selectedAnime.id, episodeId);
        
        if (result.success) {
          addToast('success', '删除剧集', '剧集删除成功');
          
          // 直接更新selectedAnime状态，避免不必要的全局刷新
          if (result.updatedAnime) {
            setSelectedAnimeId(result.updatedAnime.id);
          }
        } else {
          addToast('error', '删除剧集失败', result.error || '未知错误');
        }
      } catch (error) {
        console.error('删除剧集失败:', error);
        addToast('error', '删除剧集失败', error instanceof Error ? error.message : '未知错误');
      }
    }
  };



  // 处理剧集表单提交
  const handleEpisodeSubmit = async (episodeData: any) => {
    if (!selectedAnime) return;
    
    try {
      let result;
      if (editingEpisode) {
        // 更新现有剧集
        result = await actions.updateEpisode(selectedAnime.id, editingEpisode.id, episodeData);
        if (result.success) {
          addToast('success', '更新剧集', '剧集信息更新成功');
        } else {
          addToast('error', '更新剧集失败', result.error || '未知错误');
        }
      } else {
        // 添加新剧集
        result = await actions.addEpisode(selectedAnime.id, episodeData);
        if (result.success) {
          addToast('success', '添加剧集', `剧集 "${episodeData.title}" 添加成功`);
        } else {
          addToast('error', '添加剧集失败', result.error || '未知错误');
        }
      }
      
      if (result.success) {
        // 不再需要手动更新selectedAnime，依赖全局状态自动更新
        
        // 添加提示：修改已保存到内存，需要手动保存到文件
        toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
        
        // 关闭模态框
        setIsEpisodeModalOpen(false);
        setEditingEpisode(null);
      }
    } catch (error) {
      console.error('保存剧集失败:', error);
      addToast('error', '保存剧集失败', error instanceof Error ? error.message : '未知错误');
    }
  };

  // 处理剧集删除（从模态框）
  const handleEpisodeDelete = async () => {
    if (!selectedAnime || !editingEpisode) return;
    
    try {
      const result = await actions.deleteEpisode(selectedAnime.id, editingEpisode.id);
      if (result.success) {
        addToast('success', '删除剧集', '剧集删除成功');
        
        // 不再需要手动刷新状态
        
        // 添加提示：修改已保存到内存，需要手动保存到文件
        toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
        
        // 关闭模态框
        setIsEpisodeModalOpen(false);
        setEditingEpisode(null);
      } else {
        addToast('error', '删除剧集失败', result.error || '未知错误');
      }
    } catch (error) {
      console.error('删除剧集失败:', error);
      addToast('error', '删除剧集失败', error instanceof Error ? error.message : '未知错误');
    }
  };

  // 处理批量删除剧集
  const handleBulkDeleteEpisodes = async (episodeIds: string[]) => {
    if (!selectedAnime || episodeIds.length === 0) return;
    
    if (confirm(`确定要批量删除 ${episodeIds.length} 个剧集吗？`)) {
      try {
        // 一次性删除所有选中的剧集
        const updatedEpisodes = selectedAnime.episodes.filter(
          episode => !episodeIds.includes(episode.id)
        );
        
        const updatedAnime = {
          ...selectedAnime,
          episodes: updatedEpisodes,
          updatedAt: new Date().toISOString(),
        };
        
        // 直接更新selectedAnime状态
        setSelectedAnimeId(updatedAnime.id);
        
        // 更新全局状态 - 使用deleteEpisode逐个删除以确保一致性
        let allSuccess = true;
        for (const episodeId of episodeIds) {
          const result = await actions.deleteEpisode(selectedAnime.id, episodeId);
          if (!result.success) {
            allSuccess = false;
            console.error(`删除剧集 ${episodeId} 失败:`, result.error);
          }
        }
        
        if (allSuccess) {
          addToast('success', '批量删除剧集', `成功删除 ${episodeIds.length} 个剧集`);
          
          // 添加提示：修改已保存到内存，需要手动保存到文件
          toast.info('修改已保存到内存', '请点击保存按钮保存到文件', 5000);
        } else {
          addToast('error', '批量删除剧集失败', '部分剧集删除失败，请检查');
        }
      } catch (error) {
        console.error('批量删除剧集失败:', error);
        addToast('error', '批量删除剧集失败', error instanceof Error ? error.message : '未知错误');
      }
    }
  };

  // 关闭剧集模态框
  const handleCloseEpisodeModal = () => {
    setIsEpisodeModalOpen(false);
    setEditingEpisode(null);
  };

  // 同步selectedAnime和全局状态
  // 同步selectedAnime和全局状态
  useEffect(() => {
    if (selectedAnime) {
      // 从全局状态中查找最新的anime数据
      const currentAnime = state.animeList.find(a => a.id === selectedAnime.id);
      if (currentAnime && JSON.stringify(currentAnime) !== JSON.stringify(selectedAnime)) {
        setSelectedAnimeId(currentAnime.id);
      } else if (!currentAnime) {
        // 如果selectedAnime指向的动漫在全局状态中不存在，重置为null
        // 这通常发生在打开新文件时
        setSelectedAnimeId(null);
      }
    }
  }, [state.animeList]); // 只依赖state.animeList，不依赖selectedAnime

  // 当打开新文件时，重置selectedAnime
  useEffect(() => {
    // 当currentFilePath变化时（打开新文件），重置selectedAnime
    if (state.currentFilePath) {
      // 如果当前有选中的动漫，检查它是否存在于新文件中
      if (selectedAnime) {
        const existsInNewFile = state.animeList.some(a => a.id === selectedAnime.id);
        if (!existsInNewFile) {
          setSelectedAnimeId(null);
        }
      }
    }
  }, [state.currentFilePath]); // 依赖currentFilePath

  // 页面切换保护
  useUnsavedChangesGuard({
    isModified: state.isModified,
    onConfirmNavigation: () => {
      return window.confirm('有未保存的修改，确定要离开当前页面吗？');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">数据写入</h2>
        <FileOperations />
      </div>

      {/* 主内容区：左右分栏 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：番剧列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">番剧列表</h3>
              <button
                onClick={handleAddAnime}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                添加新番剧
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
              {state.animeList.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  暂无番剧数据
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {state.animeList.map((anime) => (
                    <li
                      key={anime.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedAnime?.id === anime.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleSelectAnime(anime)}
                    >
                      <div className="font-medium text-gray-900">{anime.title}</div>
                      <div className="text-sm text-gray-500">
                        {anime.episodes.length}集 • {anime.watchMethod}
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? '添加新番剧' : selectedAnime ? '编辑番剧' : '选择或添加番剧'}
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
                onDelete={selectedAnime ? () => handleDeleteAnime(selectedAnime.id) : undefined}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                请从左侧选择番剧或点击"添加新番剧"
              </div>
            )}
          </div>

          {/* 剧集表格 */}
          {selectedAnime && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">剧集管理</h3>
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

      {/* 剧集编辑模态框 */}
      <EpisodeModal
        isOpen={isEpisodeModalOpen}
        onClose={handleCloseEpisodeModal}
        onSubmit={handleEpisodeSubmit}
        episode={editingEpisode}
        animeTitle={selectedAnime?.title}
        onDelete={editingEpisode ? handleEpisodeDelete : undefined}
      />
    </div>
  );
};

export default WritePage;