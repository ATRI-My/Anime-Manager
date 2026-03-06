import React from 'react';
import { useAppDataContext, useToast, useTranslation } from '../../hooks';
import { useTheme } from '../../hooks';

interface FileOperationsProps {
  className?: string;
}

const FileOperations: React.FC<FileOperationsProps> = ({ className = '' }) => {
  const { state, actions } = useAppDataContext();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { isDark, bg, text, border } = useTheme();

  const handleNewFile = async () => {
    try {
      await actions.newFile();
      addToast('success', t('file.new'), t('file.toast.newSuccess'));
    } catch (error) {
      addToast('error', t('file.toast.newFailed'), error instanceof Error ? error.message : '');
      throw error;
    }
  };

  const handleOpenFile = async () => {
    try {
      const result = await actions.openFile();
      if (result.success) {
        addToast('success', t('file.open'), t('file.toast.openSuccess'));
      } else {
        addToast('error', t('file.toast.openFailed'), result.error || '');
      }
      return result;
    } catch (error) {
      addToast('error', t('file.toast.openFailed'), error instanceof Error ? error.message : '');
      throw error;
    }
  };

  const handleSaveFile = async () => {
    try {
      const result = await actions.saveFile();
      if (result.success) {
        addToast('success', t('file.save'), t('file.toast.saveSuccess'));
      } else {
        addToast('error', t('file.toast.saveFailed'), result.error || '');
      }
      return result;
    } catch (error) {
      addToast('error', t('file.toast.saveFailed'), error instanceof Error ? error.message : '');
      throw error;
    }
  };

  const handleSaveAsFile = async () => {
    try {
      const result = await actions.saveAsFile();
      if (result.success) {
        addToast('success', t('file.saveAs'), t('file.toast.saveAsSuccess'));
      } else {
        addToast('error', t('file.toast.saveAsFailed'), result.error || '');
      }
      return result;
    } catch (error) {
      addToast('error', t('file.toast.saveAsFailed'), error instanceof Error ? error.message : '');
      throw error;
    }
  };

  const isSaveDisabled = state.animeList.length === 0 || !state.isModified;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 按钮区域 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleNewFile}
          disabled={state.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('file.new')}
        </button>

        <button
          onClick={handleOpenFile}
          disabled={state.loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('file.open')}
        </button>

        <button
          onClick={handleSaveFile}
          disabled={isSaveDisabled || state.loading}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 ${
            state.isModified && !isSaveDisabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : isDark ? 'bg-neutral-700 text-gray-300 focus:ring-gray-500' : 'bg-gray-300 text-gray-500 focus:ring-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {t('file.save')}
        </button>

        <button
          onClick={handleSaveAsFile}
          disabled={state.animeList.length === 0 || state.loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
          </svg>
          {t('file.saveAs')}
        </button>
      </div>

      {/* 状态信息区域 */}
      <div className={`rounded-lg p-4 space-y-3 ${bg.secondary}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${text.secondary}`}>{t('file.currentFile')}</span>
              <span className={`text-sm ${state.currentFilePath ? text.primary : text.muted}`}>
                {state.currentFilePath || t('file.noFile')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${text.secondary}`}>{t('file.status')}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                state.isModified 
                  ? isDark ? 'bg-orange-800/50 text-orange-200' : 'bg-orange-100 text-orange-800' 
                  : isDark ? 'bg-green-800/50 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                {state.isModified ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>{t('file.unsavedChanges')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('file.saved')}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {state.loading && (
            <div className={`flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">{t('file.processing')}</span>
            </div>
          )}
        </div>

        {/* 文件内容摘要 */}
        {state.animeList.length > 0 && (
          <div className={`border-t pt-3 ${border.primary}`}>
            <div className={`text-sm ${text.muted}`}>
              <div className="flex items-center gap-4">
                <span>{t('file.animeCount')} <span className={`font-medium ${text.secondary}`}>{state.animeList.length}</span></span>
                <span>{t('file.dataVersion')} <span className={`font-medium ${text.secondary}`}>1.0.0</span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误信息区域 */}
      {state.error && (
        <div className={`rounded-lg p-4 border ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className={`text-sm font-medium ${isDark ? 'text-red-200' : 'text-red-800'}`}>{t('file.operationFailed')}</h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-600'}`}>{state.error}</p>
              </div>
            </div>
            <button
              onClick={actions.clearError}
              className={isDark ? 'text-red-400 hover:text-red-200 focus:outline-none' : 'text-red-500 hover:text-red-700 focus:outline-none'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileOperations;