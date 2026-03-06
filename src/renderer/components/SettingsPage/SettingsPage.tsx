import React from 'react';
import ToolConfigForm from '../common/ToolConfigForm';
import { useAppDataContext, useToast, useTranslation } from '../../hooks';
import { LinkType, Locale, Theme, ToolConfig } from '../../../shared/types';

interface SettingsPageProps {
  className?: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ className = '' }) => {
  const { state, actions } = useAppDataContext();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { settings, loading } = state;

  // 工具测试函数
  const handleTestTool = async (toolConfig: ToolConfig, linkType: LinkType) => {
    try {
      const testUrls: Record<LinkType, string> = {
        url: 'https://www.google.com',
        magnet: 'magnet:?xt=urn:btih:test',
        localFile: 'E:\\test\\video.mp4'
      };

      const result = await (window as any).electronAPI?.openWithTool?.(
        testUrls[linkType],
        toolConfig
      );
      
      return {
        success: result?.success || false,
        message: result?.success ? '工具成功打开测试URL' : result?.error || '工具打开失败'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '测试过程中发生错误'
      };
    }
  };

  const handleSaveToolConfig = async (toolConfig: ToolConfig) => {
    try {
      const result = await actions.updateToolConfig(toolConfig);
      if (result.success) {
        addToast('success', t('settings.toolConfig'), t('settings.toast.toolConfigUpdated'));
      } else {
        addToast('error', t('settings.toast.toolConfigFailed'), result.error || '');
      }
      return result;
    } catch (error) {
      addToast('error', t('settings.toast.toolConfigFailed'), error instanceof Error ? error.message : '');
      throw error;
    }
  };

  const handleOpenDataFolder = async () => {
    try {
      const result = await (window as any).electronAPI?.openDataFolder?.();
      if (!result?.success) {
        addToast('error', t('settings.toast.openFolderFailed'), result?.error || '');
      }
    } catch (error) {
      addToast('error', '打开文件夹失败', error instanceof Error ? error.message : '未知错误');
    }
  };

  const handleThemeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Theme;
    const newSettings = { ...(settings as any), theme: value } as typeof settings;
    try {
      const result = await actions.updateSettings(newSettings as any);
      if (result.success) {
        addToast('success', t('settings.theme'), t('settings.toast.themeUpdated'));
      } else {
        addToast('error', t('settings.toast.themeFailed'), result.error || '');
      }
    } catch (error) {
      addToast('error', t('settings.toast.themeFailed'), error instanceof Error ? error.message : '');
    }
  };

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Locale;
    const newSettings = { ...(settings as any), language: value } as typeof settings;
    try {
      const result = await actions.updateSettings(newSettings as any);
      if (result.success) {
        addToast('success', t('settings.language'), t('settings.toast.languageUpdated'));
      } else {
        addToast('error', t('settings.toast.languageFailed'), result.error || '');
      }
    } catch (error) {
      addToast('error', t('settings.toast.languageFailed'), error instanceof Error ? error.message : '');
    }
  };

  const themeForLoading: Theme = state.settings?.theme || 'light';
  const isDarkLoading = themeForLoading === 'dark';

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDarkLoading ? 'text-gray-300' : 'text-gray-600'}>{t('settings.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className={`mb-4 ${isDarkLoading ? 'text-gray-300' : 'text-gray-600'}`}>{t('settings.notLoaded')}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('settings.reloadPage')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const theme: Theme = settings.theme || 'light';
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.title')}</h2>
        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow p-6' : 'bg-white rounded-lg shadow p-6'}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.appSettings')}</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('settings.dataPath')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="%APPDATA%\\anime-manager\\"
                    readOnly
                    className={`flex-1 px-3 py-2 border rounded-md ${
                      isDark
                        ? 'bg-neutral-800 border-gray-600 text-gray-100 placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={handleOpenDataFolder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {t('settings.openFolder')}
                  </button>
                </div>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('settings.dataPathHint')}</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoScan"
                  checked={true}
                  readOnly
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${
                    isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'
                  }`}
                />
                <label
                  htmlFor="autoScan"
                  className={`ml-2 block text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  {t('settings.autoScan')}
                </label>
              </div>
            </div>
          </div>

          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow p-6' : 'bg-white rounded-lg shadow p-6'}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.uiSettings')}</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('settings.language')}
                </label>
                <select
                  value={settings.language || 'zh-CN'}
                  onChange={handleLanguageChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
                      ? 'bg-neutral-800 border-gray-600 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t('settings.theme')}
                </label>
                <select
                  value={settings.theme || 'light'}
                  onChange={handleThemeChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
                      ? 'bg-neutral-800 border-gray-600 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="light">{t('settings.themeLight')}</option>
                  <option value="dark">{t('settings.themeDark')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow p-6' : 'bg-white rounded-lg shadow p-6'}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.toolConfig')}</h3>
            <ToolConfigForm
              config={settings.toolConfig}
              onSave={handleSaveToolConfig}
              onTest={handleTestTool}
            />
          </div>

          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow p-6' : 'bg-white rounded-lg shadow p-6'}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.testFeature')}</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleTestTool(settings.toolConfig, 'url')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {t('settings.testCurrentTool')}
              </button>
               <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('settings.reloadPage')}
              </button>
              <button
                onClick={() => console.log('清理缓存')}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {t('settings.clearCache')}
              </button>
            </div>
          </div>

          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow p-6' : 'bg-white rounded-lg shadow p-6'}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{t('settings.about')}</h3>
            <div className={`space-y-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
               <p><strong>{t('settings.aboutVersion')}</strong> 1.0.0</p>
               <p><strong>Electron:</strong> 25.9.8</p>
               <p><strong>React:</strong> 18.3.1</p>
               <p><strong>TypeScript:</strong> 5.9.3</p>
               <p><strong>Vite:</strong> 4.5.14</p>
              <p className={`pt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('settings.aboutFooter')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;