import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Anime, Episode, AppData, Settings, ToolConfig } from '../../shared/types';
import { DEFAULT_APP_DATA, DEFAULT_SETTINGS } from '../../shared/constants';
import { generateId, formatDate } from '../../shared/utils';
import '../../renderer/global.d.ts';

export interface AppDataState {
  animeList: Anime[];
  settings: Settings | null;
  currentFilePath: string | null;
  isModified: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppDataActions {
  // 文件操作
  newFile: () => Promise<void>;
  openFile: () => Promise<{ success: boolean; error?: string }>;
  saveFile: () => Promise<{ success: boolean; error?: string }>;
  saveAsFile: () => Promise<{ success: boolean; error?: string }>;
  
  // 动漫数据操作
  addAnime: (animeData: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateAnime: (id: string, updates: Partial<Anime>) => Promise<{ success: boolean; error?: string }>;
  deleteAnime: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // 剧集操作 - 修改返回值包含updatedAnime
  addEpisode: (animeId: string, episodeData: Omit<Episode, 'id'>) => Promise<{ 
    success: boolean; 
    error?: string;
    updatedAnime?: Anime; // 新增：返回更新后的动漫
  }>;

  updateEpisode: (animeId: string, episodeId: string, updates: Partial<Episode>) => Promise<{ 
    success: boolean; 
    error?: string;
    updatedAnime?: Anime; // 新增：返回更新后的动漫
  }>;

  deleteEpisode: (animeId: string, episodeId: string) => Promise<{ 
    success: boolean; 
    error?: string;
    updatedAnime?: Anime; // 新增：返回更新后的动漫
  }>;
  
  // 设置操作
  updateSettings: (settings: Settings) => Promise<{ success: boolean; error?: string }>;
  updateToolConfig: (toolConfig: ToolConfig) => Promise<{ success: boolean; error?: string }>;
  
  // 工具方法
  reloadData: () => Promise<void>;
  clearError: () => void;
}

export interface AppDataContextType {
  state: AppDataState;
  actions: AppDataActions;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppDataContext must be used within an AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppDataState>({
    animeList: [],
    settings: null,
    currentFilePath: null,
    isModified: false,
    loading: false,
    error: null,
  });

  // 从文件加载数据
  const loadFromFile = useCallback(async (filePath?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let targetFilePath = filePath;
      if (!targetFilePath) {
        const dialogResult = await window.electronAPI?.openFileDialog?.();
        if (dialogResult?.canceled || !dialogResult?.filePaths?.length) {
          setState(prev => ({ ...prev, loading: false }));
          return { success: false, error: '用户取消选择文件' };
        }
        targetFilePath = dialogResult.filePaths[0];
      }
      
      const content = await window.electronAPI?.readFile?.(targetFilePath);
      
      // 验证数据格式
      if (!content || typeof content !== 'object') {
        throw new Error('文件格式无效');
      }
      
      const appData = content as AppData;
      
      // 保存文件路径到localStorage
      localStorage.setItem('lastAnimeDataFilePath', targetFilePath);
      
      setState(prev => ({
        ...prev,
        animeList: appData.animeList || [],
        settings: DEFAULT_SETTINGS,
        currentFilePath: targetFilePath,
        isModified: false,
        loading: false,
        error: null,
      }));
      
      return { success: true };
    } catch (error) {
      console.error('加载文件失败:', error);
      const errorMessage = error instanceof Error ? error.message : '加载文件失败';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // 保存数据到文件
  const saveToFile = useCallback(async (filePath?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let targetFilePath = filePath;
      if (!targetFilePath) {
        const dialogResult = await window.electronAPI?.saveFileDialog?.();
        if (dialogResult?.canceled || !dialogResult?.filePath) {
          setState(prev => ({ ...prev, loading: false }));
          return { success: false, error: '用户取消保存' };
        }
        targetFilePath = dialogResult.filePath;
      }
      
      const appData: AppData = {
        version: '1.0.0',
        animeList: state.animeList,
      };
      
      const result = await window.electronAPI?.writeFile?.(targetFilePath, appData);
      
      if (result?.success) {
        // 保存文件路径到localStorage
        localStorage.setItem('lastAnimeDataFilePath', targetFilePath);
        
        setState(prev => ({
          ...prev,
          currentFilePath: targetFilePath,
          isModified: false,
          loading: false,
        }));
        return { success: true };
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存文件失败:', error);
      const errorMessage = error instanceof Error ? error.message : '保存文件失败';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [state.animeList]);

  // 文件操作
  const newFile = useCallback(async () => {
    console.log('newFile');
    setState(prev => ({
      ...prev,
      animeList: DEFAULT_APP_DATA.animeList,
      settings: DEFAULT_SETTINGS,
      currentFilePath: null,
      isModified: false,
      error: null,
    }));
  }, []);

  const openFile = useCallback(async () => {
    console.log('openFile');
    return await loadFromFile();
  }, [loadFromFile]);

  // 工具方法
  const reloadData = useCallback(async () => {
    console.log('reloadData');
    if (!state.currentFilePath) {
      setState(prev => ({ ...prev, error: '没有打开的文件可以重新加载' }));
      return;
    }
    
    await loadFromFile(state.currentFilePath);
  }, [state.currentFilePath, loadFromFile]);

  const saveAsFile = useCallback(async () => {
    console.log('saveAsFile');
    const result = await saveToFile();
    
    // 保存成功后，更新内存中的数据源路径
    if (result.success) {
      // 这里可以触发数据刷新，确保查询页面使用最新数据
      await reloadData();
    }
    
    return result;
  }, [saveToFile, reloadData]);

  const saveFile = useCallback(async () => {
    console.log('saveFile');
    if (!state.currentFilePath) {
      console.log('没有文件路径，调用 saveAsFile');
      return await saveAsFile();
    }
    
    const result = await saveToFile(state.currentFilePath);
    
    // 保存成功后，更新内存中的数据源路径
    if (result.success) {
      // 这里可以触发数据刷新，确保查询页面使用最新数据
      await reloadData();
    }
    
    return result;
  }, [state.currentFilePath, saveAsFile, saveToFile, reloadData]);

  // 动漫数据操作
  const addAnime = useCallback(async (animeData: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // 验证必填字段
      if (!animeData.title?.trim()) {
        return { success: false, error: '标题不能为空' };
      }
      if (!animeData.watchMethod?.trim()) {
        return { success: false, error: '观看方式不能为空' };
      }
      
      const newAnime: Anime = {
        ...animeData,
        id: generateId(),
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
      };

      const updatedList = [...state.animeList, newAnime];
      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true };
    } catch (error) {
      console.error('添加动漫失败:', error);
      const errorMessage = error instanceof Error ? error.message : '添加动漫失败';
      return { success: false, error: errorMessage };
    }
  }, [state.animeList]);

  const updateAnime = useCallback(async (id: string, updates: Partial<Anime>) => {
    try {
      // 验证ID是否存在
      const animeExists = state.animeList.some(anime => anime.id === id);
      if (!animeExists) {
        return { success: false, error: '动漫不存在' };
      }
      
      // 防止更新系统字段
      const { id: _, createdAt: __, updatedAt: ___, ...safeUpdates } = updates;
      
      // 验证更新数据
      if (safeUpdates.title !== undefined && !safeUpdates.title.trim()) {
        return { success: false, error: '标题不能为空' };
      }
      if (safeUpdates.watchMethod !== undefined && !safeUpdates.watchMethod.trim()) {
        return { success: false, error: '观看方式不能为空' };
      }
      
      const updatedList = state.animeList.map(anime => 
        anime.id === id 
          ? { ...anime, ...safeUpdates, updatedAt: formatDate(new Date()) }
          : anime
      );
      
      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true };
    } catch (error) {
      console.error('更新动漫失败:', error);
      const errorMessage = error instanceof Error ? error.message : '更新动漫失败';
      return { success: false, error: errorMessage };
    }
  }, [state.animeList]);

  const deleteAnime = useCallback(async (id: string) => {
    try {
      // 验证ID是否存在
      const animeExists = state.animeList.some(anime => anime.id === id);
      if (!animeExists) {
        return { success: false, error: '动漫不存在' };
      }
      
      const updatedList = state.animeList.filter(anime => anime.id !== id);
      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true };
    } catch (error) {
      console.error('删除动漫失败:', error);
      const errorMessage = error instanceof Error ? error.message : '删除动漫失败';
      return { success: false, error: errorMessage };
    }
  }, [state.animeList]);

  // 剧集操作方法
  const addEpisode = useCallback(async (animeId: string, episodeData: Omit<Episode, 'id'>) => {
    try {
      // 验证动漫ID是否存在
      const animeIndex = state.animeList.findIndex(anime => anime.id === animeId);
      if (animeIndex === -1) {
        return { success: false, error: '动漫不存在', updatedAnime: undefined };
      }

      // 验证剧集数据
      if (!episodeData.title?.trim()) {
        return { success: false, error: '剧集标题不能为空', updatedAnime: undefined };
      }
      if (!episodeData.url?.trim()) {
        return { success: false, error: '剧集链接不能为空', updatedAnime: undefined };
      }
      if (episodeData.number === undefined || episodeData.number <= 0) {
        return { success: false, error: '剧集编号必须大于0', updatedAnime: undefined };
      }

      // 检查剧集编号是否重复
      const anime = state.animeList[animeIndex];
      const episodeNumberExists = anime.episodes.some(ep => ep.number === episodeData.number);
      if (episodeNumberExists) {
        return { success: false, error: `剧集编号 ${episodeData.number} 已存在`, updatedAnime: undefined };
      }

      // 创建新剧集
      const newEpisode: Episode = {
        ...episodeData,
        id: generateId(),
      };

      // 更新动漫的剧集列表
      const updatedAnime = {
        ...anime,
        episodes: [...anime.episodes, newEpisode],
        updatedAt: formatDate(new Date()),
      };

      const updatedList = [...state.animeList];
      updatedList[animeIndex] = updatedAnime;

      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true, updatedAnime };
    } catch (error) {
      console.error('添加剧集失败:', error);
      const errorMessage = error instanceof Error ? error.message : '添加剧集失败';
      return { success: false, error: errorMessage, updatedAnime: undefined };
    }
  }, [state.animeList]);

  const updateEpisode = useCallback(async (animeId: string, episodeId: string, updates: Partial<Episode>) => {
    try {
      // 验证动漫ID是否存在
      const animeIndex = state.animeList.findIndex(anime => anime.id === animeId);
      if (animeIndex === -1) {
        return { success: false, error: '动漫不存在', updatedAnime: undefined };
      }

      const anime = state.animeList[animeIndex];
      
      // 验证剧集ID是否存在
      const episodeIndex = anime.episodes.findIndex(ep => ep.id === episodeId);
      if (episodeIndex === -1) {
        return { success: false, error: '剧集不存在', updatedAnime: undefined };
      }

      // 防止更新系统字段
      const { id: _, ...safeUpdates } = updates;

      // 验证更新数据
      if (safeUpdates.title !== undefined && !safeUpdates.title.trim()) {
        return { success: false, error: '剧集标题不能为空', updatedAnime: undefined };
      }
      if (safeUpdates.url !== undefined && !safeUpdates.url.trim()) {
        return { success: false, error: '剧集链接不能为空', updatedAnime: undefined };
      }
      if (safeUpdates.number !== undefined && safeUpdates.number <= 0) {
        return { success: false, error: '剧集编号必须大于0', updatedAnime: undefined };
      }

      // 如果更新了剧集编号，检查是否重复
      if (safeUpdates.number !== undefined) {
        const otherEpisodes = anime.episodes.filter((_, idx) => idx !== episodeIndex);
        const episodeNumberExists = otherEpisodes.some(ep => ep.number === safeUpdates.number);
        if (episodeNumberExists) {
          return { success: false, error: `剧集编号 ${safeUpdates.number} 已存在`, updatedAnime: undefined };
        }
      }

      // 更新剧集
      const updatedEpisode = {
        ...anime.episodes[episodeIndex],
        ...safeUpdates,
      };

      const updatedEpisodes = [...anime.episodes];
      updatedEpisodes[episodeIndex] = updatedEpisode;

      const updatedAnime = {
        ...anime,
        episodes: updatedEpisodes,
        updatedAt: formatDate(new Date()),
      };

      const updatedList = [...state.animeList];
      updatedList[animeIndex] = updatedAnime;

      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true, updatedAnime };
    } catch (error) {
      console.error('更新剧集失败:', error);
      const errorMessage = error instanceof Error ? error.message : '更新剧集失败';
      return { success: false, error: errorMessage, updatedAnime: undefined };
    }
  }, [state.animeList]);

  const deleteEpisode = useCallback(async (animeId: string, episodeId: string) => {
    try {
      // 验证动漫ID是否存在
      const animeIndex = state.animeList.findIndex(anime => anime.id === animeId);
      if (animeIndex === -1) {
        return { success: false, error: '动漫不存在', updatedAnime: undefined };
      }

      const anime = state.animeList[animeIndex];
      
      // 验证剧集ID是否存在
      const episodeExists = anime.episodes.some(ep => ep.id === episodeId);
      if (!episodeExists) {
        return { success: false, error: '剧集不存在', updatedAnime: undefined };
      }

      // 删除剧集
      const updatedEpisodes = anime.episodes.filter(ep => ep.id !== episodeId);
      const updatedAnime = {
        ...anime,
        episodes: updatedEpisodes,
        updatedAt: formatDate(new Date()),
      };

      const updatedList = [...state.animeList];
      updatedList[animeIndex] = updatedAnime;

      setState(prev => ({
        ...prev,
        animeList: updatedList,
        isModified: true,
      }));

      return { success: true, updatedAnime };
    } catch (error) {
      console.error('删除剧集失败:', error);
      const errorMessage = error instanceof Error ? error.message : '删除剧集失败';
      return { success: false, error: errorMessage, updatedAnime: undefined };
    }
  }, [state.animeList]);

  // 设置操作
  const updateSettings = useCallback(async (settings: Settings) => {
    try {
      // 保存设置到Electron API
      const result = await window.electronAPI?.saveSettings?.(settings);
      
      if (!result?.success) {
        throw new Error('保存设置失败');
      }
      
      setState(prev => ({
        ...prev,
        settings,
        isModified: false, // 设置已保存，不需要标记为已修改
      }));

      return { success: true };
    } catch (error) {
      console.error('更新设置失败:', error);
      const errorMessage = error instanceof Error ? error.message : '更新设置失败';
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateToolConfig = useCallback(async (toolConfig: ToolConfig) => {
    try {
      const newSettings = { ...state.settings, toolConfig } as Settings;
      
      // 保存设置到Electron API
      const result = await window.electronAPI?.saveSettings?.(newSettings);
      
      if (!result?.success) {
        throw new Error('保存工具配置失败');
      }
      
      setState(prev => ({
        ...prev,
        settings: newSettings,
        isModified: false, // 设置已保存，不需要标记为已修改
      }));

      return { success: true };
    } catch (error) {
      console.error('更新工具配置失败:', error);
      const errorMessage = error instanceof Error ? error.message : '更新工具配置失败';
      return { success: false, error: errorMessage };
    }
  }, [state.settings]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 初始化加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('初始化加载动漫数据...');
        
        // 尝试从localStorage获取上次打开的文件路径
        const lastFilePath = localStorage.getItem('lastAnimeDataFilePath');
        
        if (lastFilePath) {
          console.log('找到上次打开的文件路径:', lastFilePath);
          try {
            // 尝试加载上次打开的文件
            const data = await window.electronAPI?.readFile?.(lastFilePath);
            if (data && data.animeList) {
              console.log('从上次文件加载数据成功，动漫数量:', data.animeList.length);
              setState(prev => ({
                ...prev,
                animeList: data.animeList,
                settings: DEFAULT_SETTINGS,
                currentFilePath: lastFilePath,
                loading: false,
              }));
              return;
            }
          } catch (fileError) {
            console.warn('加载上次文件失败，回退到默认数据:', fileError);
          }
        }
        
        // 回退到默认数据
        console.log('使用默认数据源...');
        const data = await window.electronAPI?.readAnimeData?.();
        console.log('加载到的数据:', data);
        
        if (data && data.animeList) {
          setState(prev => ({
            ...prev,
            animeList: data.animeList,
            settings: DEFAULT_SETTINGS,
            loading: false,
          }));
          console.log('数据加载成功，动漫数量:', data.animeList.length);
        } else {
          console.log('没有数据或数据格式错误，使用默认数据');
          setState(prev => ({
            ...prev,
            animeList: DEFAULT_APP_DATA.animeList,
            settings: DEFAULT_SETTINGS,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('初始化加载数据失败:', error);
        setState(prev => ({
          ...prev,
          error: '加载数据失败',
          loading: false,
        }));
      }
    };

    loadInitialData();
  }, []);

  const contextValue: AppDataContextType = {
    state,
    actions: {
      newFile,
      openFile,
      saveFile,
      saveAsFile,
      addAnime,
      updateAnime,
      deleteAnime,
      addEpisode,
      updateEpisode,
      deleteEpisode,
      updateSettings,
      updateToolConfig,
      reloadData,
      clearError,
    },
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};