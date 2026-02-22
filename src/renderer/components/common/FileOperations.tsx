import React from 'react';
import { useAppDataContext, useToast } from '../../hooks';

interface FileOperationsProps {
  className?: string;
}

const FileOperations: React.FC<FileOperationsProps> = ({ className = '' }) => {
  const { state, actions } = useAppDataContext();
  const { addToast } = useToast();

  const handleNewFile = async () => {
    try {
      await actions.newFile();
      addToast('success', '新建文件', '已创建新的数据文件');
    } catch (error) {
      addToast('error', '新建文件失败', error instanceof Error ? error.message : '未知错误');
      throw error;
    }
  };

  const handleOpenFile = async () => {
    try {
      const result = await actions.openFile();
      if (result.success) {
        addToast('success', '打开文件', '文件打开成功');
      } else {
        addToast('error', '打开文件失败', result.error || '未知错误');
      }
      return result;
    } catch (error) {
      addToast('error', '打开文件失败', error instanceof Error ? error.message : '未知错误');
      throw error;
    }
  };

  const handleSaveFile = async () => {
    try {
      const result = await actions.saveFile();
      if (result.success) {
        addToast('success', '保存文件', '文件保存成功');
      } else {
        addToast('error', '保存文件失败', result.error || '未知错误');
      }
      return result;
    } catch (error) {
      addToast('error', '保存文件失败', error instanceof Error ? error.message : '未知错误');
      throw error;
    }
  };

  const handleSaveAsFile = async () => {
    try {
      const result = await actions.saveAsFile();
      if (result.success) {
        addToast('success', '另存为', '文件另存为成功');
      } else {
        addToast('error', '另存为失败', result.error || '未知错误');
      }
      return result;
    } catch (error) {
      addToast('error', '另存为失败', error instanceof Error ? error.message : '未知错误');
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
          新建
        </button>

        <button
          onClick={handleOpenFile}
          disabled={state.loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          打开...
        </button>

        <button
          onClick={handleSaveFile}
          disabled={isSaveDisabled || state.loading}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 ${
            state.isModified && !isSaveDisabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 focus:ring-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          保存
        </button>

        <button
          onClick={handleSaveAsFile}
          disabled={state.animeList.length === 0 || state.loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
          </svg>
          另存为...
        </button>
      </div>

      {/* 状态信息区域 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">当前文件:</span>
              <span className={`text-sm ${state.currentFilePath ? 'text-gray-900' : 'text-gray-500'}`}>
                {state.currentFilePath || '未选择文件'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">文件状态:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                state.isModified 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {state.isModified ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>有未保存的修改</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>文件已保存</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {state.loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">处理中...</span>
            </div>
          )}
        </div>

        {/* 文件内容摘要 */}
        {state.animeList.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>动漫数量: <span className="font-medium">{state.animeList.length}</span></span>
                <span>数据版本: <span className="font-medium">1.0.0</span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误信息区域 */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800">操作失败</h4>
                <p className="text-sm text-red-600 mt-1">{state.error}</p>
              </div>
            </div>
            <button
              onClick={actions.clearError}
              className="text-red-500 hover:text-red-700 focus:outline-none"
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