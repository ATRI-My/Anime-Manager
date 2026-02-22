import { useState, useEffect, useCallback } from 'react';
import { Anime, AppData } from '../../shared/types';
import { generateId, formatDate } from '../../shared/utils';

export const useAnimeData = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  const loadAnimeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.electronAPI.readAnimeData();
      setAnimeList(data.animeList || []);
    } catch (err) {
      console.error('加载动漫数据失败:', err);
      setError('加载数据失败');
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存数据
  const saveAnimeData = useCallback(async (data: AppData) => {
    try {
      await window.electronAPI.writeAnimeData(data);
      return { success: true };
    } catch (err) {
      console.error('保存动漫数据失败:', err);
      return { success: false, error: '保存失败' };
    }
  }, []);

  // 添加动漫
  const addAnime = useCallback(async (animeData: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnime: Anime = {
      ...animeData,
      id: generateId(),
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
    };

    const updatedList = [...animeList, newAnime];
    const result = await saveAnimeData({ version: '1.0.0', animeList: updatedList });
    
    if (result.success) {
      setAnimeList(updatedList);
    }
    
    return result;
  }, [animeList, saveAnimeData]);

  // 更新动漫
  const updateAnime = useCallback(async (id: string, updates: Partial<Anime>) => {
    const updatedList = animeList.map(anime => 
      anime.id === id 
        ? { ...anime, ...updates, updatedAt: formatDate(new Date()) }
        : anime
    );
    
    const result = await saveAnimeData({ version: '1.0.0', animeList: updatedList });
    
    if (result.success) {
      setAnimeList(updatedList);
    }
    
    return result;
  }, [animeList, saveAnimeData]);

  // 删除动漫
  const deleteAnime = useCallback(async (id: string) => {
    const updatedList = animeList.filter(anime => anime.id !== id);
    const result = await saveAnimeData({ version: '1.0.0', animeList: updatedList });
    
    if (result.success) {
      setAnimeList(updatedList);
    }
    
    return result;
  }, [animeList, saveAnimeData]);

  // 初始化加载
  useEffect(() => {
    loadAnimeData();
  }, [loadAnimeData]);

  return {
    animeList,
    loading,
    error,
    loadAnimeData,
    addAnime,
    updateAnime,
    deleteAnime,
  };
};