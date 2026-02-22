import React, { useState, useEffect } from 'react';
import { ToolConfig } from '../../../shared/types';

interface ToolConfigFormProps {
  config: ToolConfig;
  onSave: (config: ToolConfig) => Promise<{ success: boolean; error?: string }>;
  onTest: (config: ToolConfig) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}

const ToolConfigForm: React.FC<ToolConfigFormProps> = ({
  config: initialConfig,
  onSave,
  onTest,
  className = ''
}) => {
  const [config, setConfig] = useState<ToolConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveResult(null);
    
    try {
      const result = await onSave(config);
      setSaveResult({
        success: result.success,
        message: result.success ? '配置保存成功' : (result.error || '保存失败')
      });
    } catch (error) {
      setSaveResult({
        success: false,
        message: error instanceof Error ? error.message : '保存配置时发生错误'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTool = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(config);
      setTestResult({
        success: result.success,
        message: result.success ? '工具测试成功' : (result.error || '测试失败')
      });
      
      // 更新配置中的测试结果
      if (result.success) {
        setConfig({
          ...config,
          lastTestResult: {
            success: true,
            message: '测试成功',
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : '测试工具时发生错误'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleBrowsePath = async () => {
    try {
      const result = await window.electronAPI.openFileDialog();
      
      if (!result.canceled && result.filePaths.length > 0) {
        setConfig({
          ...config,
          customTool: {
            ...config.customTool,
            path: result.filePaths[0]
          }
        });
      }
    } catch (error) {
      console.error('打开文件对话框失败:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-6">
        {/* 工具类型选择 */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">默认打开方式</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="defaultBrowser"
                name="toolType"
                checked={!config.useCustomTool}
                onChange={() => setConfig({ ...config, useCustomTool: false })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="defaultBrowser" className="ml-3 block text-sm font-medium text-gray-700">
                系统默认浏览器
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="customTool"
                name="toolType"
                checked={config.useCustomTool}
                onChange={() => setConfig({ ...config, useCustomTool: true })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="customTool" className="ml-3 block text-sm font-medium text-gray-700">
                自定义工具
              </label>
            </div>
          </div>
        </div>

        {/* 自定义工具设置 */}
        {config.useCustomTool && (
          <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-900 mb-2">自定义工具设置</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工具名称
              </label>
              <input
                type="text"
                value={config.customTool.name}
                onChange={(e) => setConfig({
                  ...config,
                  customTool: { ...config.customTool, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：PotPlayer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工具路径
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={config.customTool.path}
                  onChange={(e) => setConfig({
                    ...config,
                    customTool: { ...config.customTool, path: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：C:\Program Files\PotPlayer\PotPlayer.exe"
                />
                <button
                  type="button"
                  onClick={handleBrowsePath}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  浏览...
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">选择可执行文件（.exe）</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                命令行参数
              </label>
              <input
                type="text"
                value={config.customTool.arguments}
                onChange={(e) => setConfig({
                  ...config,
                  customTool: { ...config.customTool, arguments: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：{url} 或 /play {url}"
              />
              <p className="mt-1 text-sm text-gray-500">使用 {`{url}`} 作为URL占位符</p>
            </div>
          </div>
        )}

        {/* 状态显示 */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">当前状态</h4>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">当前工具:</span>
                <span className="text-sm text-gray-900">
                  {config.useCustomTool ? config.customTool.name || '未设置' : '系统默认浏览器'}
                </span>
              </div>
              
              {config.useCustomTool && config.customTool.path && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">工具路径:</span>
                  <span className="text-sm text-gray-900 truncate">{config.customTool.path}</span>
                </div>
              )}
              
              {config.lastTestResult && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">上次测试:</span>
                  <span className={`text-sm ${config.lastTestResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {config.lastTestResult.success ? '✓ 成功' : '✗ 失败'} - {new Date(config.lastTestResult.timestamp).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 操作结果提示 */}
        {saveResult && (
          <div className={`p-3 rounded-md ${saveResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${saveResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {saveResult.message}
            </p>
          </div>
        )}

        {testResult && (
          <div className={`p-3 rounded-md ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTestTool}
            disabled={isTesting || (config.useCustomTool && !config.customTool.path)}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isTesting || (config.useCustomTool && !config.customTool.path)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTesting ? '测试中...' : '测试工具'}
          </button>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setConfig(initialConfig)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              重置
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSaving
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSaving ? '保存中...' : '保存配置'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ToolConfigForm;