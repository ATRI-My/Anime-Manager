import { useState, useCallback } from 'react';
import { AppData } from '../../shared/types';
import { DEFAULT_APP_DATA } from '../../shared/constants';

export interface FileOperationsState {
  currentFilePath: string | null;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
  content: AppData | null;
}

export interface FileOperationsReturn {
  state: FileOperationsState;
  newFile: () => Promise<void>;
  openFile: () => Promise<void>;
  saveFile: () => Promise<{ success: boolean; error?: string }>;
  saveAsFile: () => Promise<{ success: boolean; error?: string }>;
  setContent: (content: AppData) => void;
  clearError: () => void;
}

export const useFileOperations = (): FileOperationsReturn => {
  const [state, setState] = useState<FileOperationsState>({
    currentFilePath: null,
    isModified: false,
    isLoading: false,
    error: null,
    content: null,
  });

  const newFile = useCallback(async () => {
    setState(prev => ({
      ...prev,
      currentFilePath: null,
      isModified: false,
      content: DEFAULT_APP_DATA,
      error: null,
    }));
  }, []);

  const openFile = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await window.electronAPI.openFileDialog();
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = await window.electronAPI.readFile(filePath);
        
        setState({
          currentFilePath: filePath,
          isModified: false,
          isLoading: false,
          error: null,
          content: content as AppData,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '打开文件失败',
      }));
    }
  }, []);

  const saveFile = useCallback(async () => {
    if (!state.content) {
      return { success: false, error: '没有内容可保存' };
    }

    if (!state.currentFilePath) {
      return await saveAsFile();
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await window.electronAPI.writeFile(state.currentFilePath, state.content);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isModified: false,
        }));
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存文件失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [state.currentFilePath, state.content]);

  const saveAsFile = useCallback(async () => {
    if (!state.content) {
      return { success: false, error: '没有内容可保存' };
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await window.electronAPI.saveFileDialog();
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electronAPI.writeFile(result.filePath, state.content);
        
        if (saveResult.success) {
          setState(prev => ({
            ...prev,
            currentFilePath: result.filePath,
            isLoading: false,
            isModified: false,
          }));
        }
        
        return saveResult;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '取消保存' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '另存为失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [state.content]);

  const setContent = useCallback((content: AppData) => {
    setState(prev => ({
      ...prev,
      content,
      isModified: true,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    newFile,
    openFile,
    saveFile,
    saveAsFile,
    setContent,
    clearError,
  };
};