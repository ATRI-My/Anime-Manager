import React, { useState, useEffect } from 'react';
import { LinkType, ToolConfig } from '../../../shared/types';
import { useTheme, useTranslation } from '../../hooks';

interface ToolConfigFormProps {
  config: ToolConfig;
  onSave: (config: ToolConfig) => Promise<{ success: boolean; error?: string }>;
  onTest: (config: ToolConfig, linkType: LinkType) => Promise<{ success: boolean; error?: string }>;
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
  const [activeType, setActiveType] = useState<LinkType>('url');
  const { isDark, bg, text, border, input } = useTheme();
  const { t } = useTranslation();

  const typeLabels: Record<LinkType, string> = {
    url: t('toolConfig.linkTypeUrl'),
    magnet: t('toolConfig.linkTypeMagnet'),
    localFile: t('toolConfig.linkTypeLocalFile'),
  };

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
        message: result.success ? t('toolConfig.saveSuccess') : (result.error || t('toolConfig.saveFailed'))
      });
    } catch (error) {
      setSaveResult({
        success: false,
        message: error instanceof Error ? error.message : t('toolConfig.saveError')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTool = async () => {
    const currentType = activeType;
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(config, currentType);
      setTestResult({
        success: result.success,
        message: result.success ? t('toolConfig.testSuccess') : (result.error || t('toolConfig.testFailed'))
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : t('toolConfig.testError')
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleBrowsePath = async () => {
    try {
      const result = await window.electronAPI.openFileDialog();
      
      if (!result.canceled && result.filePaths.length > 0) {
        const typeConfig = config[activeType];
        setConfig({
          ...config,
          [activeType]: {
            ...typeConfig,
            path: result.filePaths[0]
          }
        });
      }
    } catch (error) {
      console.error('打开文件对话框失败:', error);
    }
  };

  const currentTypeConfig = config[activeType];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-6">
        {/* 链接类型切换 */}
        <div>
          <h4 className={`text-lg font-medium mb-4 ${text.primary}`}>{t('toolConfig.linkType')}</h4>
          <div className={`inline-flex rounded-md shadow-sm border overflow-hidden ${border.secondary}`}>
            {(['url', 'magnet', 'localFile'] as LinkType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                  activeType === type
                    ? 'bg-blue-600 text-white'
                    : isDark ? 'bg-neutral-800 text-gray-200 hover:bg-neutral-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${type !== 'localFile' ? `border-r ${border.secondary}` : ''}`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
          <p className={`mt-1 text-sm ${text.muted}`}>
            {t('toolConfig.linkTypeHint')}
          </p>
        </div>

        <div className={`space-y-4 border rounded-lg p-4 ${border.secondary} ${bg.secondary}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-medium ${text.primary}`}>
              {typeLabels[activeType]} {t('toolConfig.customToolSuffix')}
            </h4>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={currentTypeConfig.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [activeType]: {
                      ...currentTypeConfig,
                      enabled: e.target.checked,
                    },
                  })
                }
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'}`}
              />
              <span className={`ml-2 text-sm ${text.secondary}`}>{t('toolConfig.enableCustomTool')}</span>
            </label>
          </div>
            
          <div>
            <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
              {t('toolConfig.toolName')}
            </label>
            <input
              type="text"
              value={currentTypeConfig.name}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [activeType]: {
                    ...currentTypeConfig,
                    name: e.target.value,
                  },
                })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
              placeholder={t('toolConfig.toolNamePlaceholder')}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
              {t('toolConfig.toolPath')}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentTypeConfig.path}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [activeType]: {
                      ...currentTypeConfig,
                      path: e.target.value,
                    },
                  })
                }
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
                placeholder={t('toolConfig.toolPathPlaceholder')}
              />
              <button
                type="button"
                onClick={handleBrowsePath}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDark ? 'bg-neutral-700 text-gray-200 hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {t('toolConfig.browse')}
              </button>
            </div>
            <p className={`mt-1 text-sm ${text.muted}`}>{t('toolConfig.selectExeHint')}</p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
              {t('toolConfig.argsLabel')}
            </label>
            <input
              type="text"
              value={currentTypeConfig.arguments}
              onChange={(e) =>
                setConfig({
                  ...config,
                  [activeType]: {
                    ...currentTypeConfig,
                    arguments: e.target.value,
                  },
                })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
              placeholder={t('toolConfig.argsPlaceholder')}
            />
            <p className={`mt-1 text-sm ${text.muted}`}>
              {t('toolConfig.argsHint')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className={`text-lg font-medium ${text.primary}`}>{t('toolConfig.currentStatus')}</h4>
          
          <div className={`border rounded-lg p-4 ${bg.secondary} ${border.secondary}`}>
            <div className="space-y-2">
              {(['url', 'magnet', 'localFile'] as LinkType[]).map((type) => {
                const cfg = config[type];
                return (
                  <div key={type} className="mt-2">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium mr-2 ${text.secondary}`}>
                        {typeLabels[type]}:
                      </span>
                      <span className={`text-sm ${text.primary}`}>
                        {cfg.enabled ? cfg.name || t('toolConfig.notSet') : t('toolConfig.systemDefault')}
                      </span>
                    </div>
                    {cfg.enabled && cfg.path && (
                      <div className="flex items-center">
                        <span className={`text-sm font-medium mr-2 ${text.secondary}`}>{t('toolConfig.pathLabel')}</span>
                        <span className={`text-sm truncate ${text.primary}`}>{cfg.path}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 操作结果提示 */}
        {saveResult && (
          <div className={`p-3 rounded-md border ${saveResult.success ? (isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200') : (isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')}`}>
            <p className={`text-sm ${saveResult.success ? (isDark ? 'text-green-200' : 'text-green-800') : (isDark ? 'text-red-200' : 'text-red-800')}`}>
              {saveResult.message}
            </p>
          </div>
        )}

        {testResult && (
          <div className={`p-3 rounded-md border ${testResult.success ? (isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200') : (isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')}`}>
            <p className={`text-sm ${testResult.success ? (isDark ? 'text-green-200' : 'text-green-800') : (isDark ? 'text-red-200' : 'text-red-800')}`}>
              {testResult.message}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className={`flex justify-between pt-4 border-t ${border.primary}`}>
          <button
            type="button"
            onClick={handleTestTool}
            disabled={isTesting || (currentTypeConfig.enabled && !currentTypeConfig.path)}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isTesting || (currentTypeConfig.enabled && !currentTypeConfig.path)
                ? isDark ? 'bg-neutral-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTesting ? t('toolConfig.testing') : t('toolConfig.testCurrentType')}
          </button>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setConfig(initialConfig)}
              className={`px-6 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${border.primary} ${text.secondary} ${isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'}`}
            >
              {t('toolConfig.reset')}
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
              {isSaving ? t('toolConfig.saving') : t('toolConfig.saveConfig')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ToolConfigForm;