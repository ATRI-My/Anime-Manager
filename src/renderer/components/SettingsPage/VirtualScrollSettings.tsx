import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useVirtualScrollConfig } from '../../hooks/useVirtualScrollConfig';
import { VirtualScrollConfig } from '../../../shared/types';
import { DEFAULT_VIRTUAL_SCROLL_CONFIG } from '../../../shared/constants';

interface VirtualScrollSettingsProps {
  className?: string;
}

const VirtualScrollSettings: React.FC<VirtualScrollSettingsProps> = ({ className = '' }) => {
  const { settings, saveSettings } = useSettings();
  const { config } = useVirtualScrollConfig();
  const [localConfig, setLocalConfig] = useState<VirtualScrollConfig>(config);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const newSettings = {
        ...settings!,
        virtualScrollConfig: localConfig
      };
      
      const result = await saveSettings(newSettings);
      if (result.success) {
        setMessage({ type: 'success', text: '虚拟滚动配置已保存' });
      } else {
        setMessage({ type: 'error', text: result.error || '保存失败' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_VIRTUAL_SCROLL_CONFIG);
  };

  const handleToggleEnabled = () => {
    setLocalConfig(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const updateAnimeGridConfig = (field: keyof typeof config.animeGrid, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      animeGrid: {
        ...prev.animeGrid,
        [field]: value
      }
    }));
  };

  const updateEpisodeListConfig = (field: keyof typeof config.episodeList, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      episodeList: {
        ...prev.episodeList,
        [field]: value
      }
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">虚拟滚动配置</h3>
        <p className="text-sm text-gray-600">
          配置虚拟滚动组件的参数，优化大量数据时的性能
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* 全局设置 */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">启用虚拟滚动</h4>
              <p className="text-sm text-gray-500">启用后，当项目数量超过阈值时会自动使用虚拟化</p>
            </div>
            <button
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                localConfig.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  localConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预渲染数量 (overscan)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10"
                value={localConfig.overscan}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, overscan: parseInt(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-gray-600 w-8">{localConfig.overscan}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              滚动时额外渲染的项目数量，提高滚动流畅度
            </p>
          </div>
        </div>

        {/* 动漫网格配置 */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">动漫网格配置</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                列数
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={localConfig.animeGrid.columns}
                onChange={(e) => updateAnimeGridConfig('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                间距 (px)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={localConfig.animeGrid.gap}
                onChange={(e) => updateAnimeGridConfig('gap', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目高度 (px)
              </label>
              <input
                type="number"
                min="100"
                max="1000"
                value={localConfig.animeGrid.itemHeight}
                onChange={(e) => updateAnimeGridConfig('itemHeight', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                虚拟化阈值
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={localConfig.animeGrid.threshold}
                onChange={(e) => updateAnimeGridConfig('threshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                动漫数量超过此值时使用虚拟化
              </p>
            </div>
          </div>
        </div>

        {/* 剧集列表配置 */}
        <div className="pb-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">剧集列表配置</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目高度 (px)
              </label>
              <input
                type="number"
                min="50"
                max="200"
                value={localConfig.episodeList.itemHeight}
                onChange={(e) => updateEpisodeListConfig('itemHeight', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                列表高度 (px)
              </label>
              <input
                type="number"
                min="200"
                max="2000"
                value={localConfig.episodeList.height}
                onChange={(e) => updateEpisodeListConfig('height', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                虚拟化阈值
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={localConfig.episodeList.threshold}
                onChange={(e) => updateEpisodeListConfig('threshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                剧集数量超过此值时使用虚拟化
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={saving}
          >
            恢复默认
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存配置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualScrollSettings;