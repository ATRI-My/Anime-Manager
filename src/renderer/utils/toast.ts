import { ToastType } from '../contexts/ToastContext';

// 全局toast函数引用
let toastContext: {
  addToast: (type: ToastType, title: string, message: string, duration?: number) => void;
} | null = null;

// 初始化toast系统
export const initToast = (context: {
  addToast: (type: ToastType, title: string, message: string, duration?: number) => void;
}) => {
  toastContext = context;
};

// 检查toast系统是否已初始化
const checkInitialized = () => {
  if (!toastContext) {
    console.warn('Toast系统未初始化，请确保在App.tsx中使用了ToastProvider');
    return false;
  }
  return true;
};

// 显示toast的辅助函数
const showToast = (type: ToastType, title: string, message: string, duration?: number) => {
  if (!checkInitialized()) return;
  toastContext!.addToast(type, title, message, duration);
};

// 导出toast函数
const toast = {
  success: (title: string, message: string, duration?: number) => {
    showToast('success', title, message, duration);
  },
  error: (title: string, message: string, duration?: number) => {
    showToast('error', title, message, duration);
  },
  warning: (title: string, message: string, duration?: number) => {
    showToast('warning', title, message, duration);
  },
  info: (title: string, message: string, duration?: number) => {
    showToast('info', title, message, duration);
  },
};

export default toast;