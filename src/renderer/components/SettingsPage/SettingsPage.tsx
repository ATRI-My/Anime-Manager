import React from 'react';
import ToolConfigForm from '../common/ToolConfigForm';
import { useAppDataContext, useToast } from '../../hooks';
import { ToolConfig } from '../../../shared/types';

interface SettingsPageProps {
  className?: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ className = '' }) => {
  const { state, actions } = useAppDataContext();
  const { addToast } = useToast();
  const { settings, loading } = state;

  // 工具测试函数
  const handleTestTool = async (toolConfig: ToolConfig) => {
    try {
      const result = await (window as any).electronAPI?.openWithTool?.(
        'https://www.google.com',
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
        addToast('success', '更新工具配置', '工具配置更新成功');
      } else {
        addToast('error', '更新工具配置失败', result.error || '未知错误');
      }
      return result;
    } catch (error) {
      addToast('error', '更新工具配置失败', error instanceof Error ? error.message : '未知错误');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载设置中...</p>
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
            <p className="text-gray-600 mb-4">未加载设置</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              重新加载页面
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">设置</h2>
        <p className="text-gray-600 mb-6">配置应用参数和工具</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">应用设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  扫描路径
                </label>
                <input
                  type="text"
                  value="C:/Anime"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">此功能暂未实现</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoScan"
                  checked={true}
                  readOnly
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoScan" className="ml-2 block text-sm text-gray-700">
                  启动时自动扫描
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">界面设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  语言
                </label>
                <select
                  value="zh-CN"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主题
                </label>
                <select
                  value="light"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="auto">自动</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">工具配置</h3>
            <ToolConfigForm
              config={settings.toolConfig}
              onSave={handleSaveToolConfig}
              onTest={handleTestTool}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">测试功能</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleTestTool(settings.toolConfig)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                测试当前工具
              </button>
               <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                重新加载页面
              </button>
              <button
                onClick={() => console.log('清理缓存')}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                清理缓存
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">关于</h3>
            <div className="space-y-3 text-gray-700">
               <p><strong>版本:</strong> 1.0.0</p>
               <p><strong>Electron:</strong> 25.9.8</p>
               <p><strong>React:</strong> 18.3.1</p>
               <p><strong>TypeScript:</strong> 5.9.3</p>
               <p><strong>Vite:</strong> 4.5.14</p>
              <p className="pt-4 text-sm text-gray-500">
                 动漫资源管理器桌面应用 © 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;