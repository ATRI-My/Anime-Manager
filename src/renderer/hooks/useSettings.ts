import { useState, useEffect, useCallback } from 'react';
import { Settings, ToolConfig } from '../../shared/types';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载设置
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await (window as any).electronAPI.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('加载设置失败:', err);
      setError('加载设置失败');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存设置
  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      const result = await (window as any).electronAPI.saveSettings(newSettings);
      if (result.success) {
        setSettings(newSettings);
      }
      return result;
    } catch (err) {
      console.error('保存设置失败:', err);
      return { success: false, error: '保存设置失败' };
    }
  }, []);

  // 更新工具配置
  const updateToolConfig = useCallback(async (toolConfig: ToolConfig) => {
    const newSettings = { ...settings, toolConfig } as Settings;
    return await saveSettings(newSettings);
  }, [settings, saveSettings]);

  // 初始化加载
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings,
    updateToolConfig,
  };
};