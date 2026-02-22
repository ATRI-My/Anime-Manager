import { useEffect } from 'react';

interface UseUnsavedChangesGuardProps {
  isModified: boolean;
  onConfirmNavigation?: () => boolean;
}

export const useUnsavedChangesGuard = ({
  isModified,
  onConfirmNavigation
}: UseUnsavedChangesGuardProps) => {
  useEffect(() => {
    if (!isModified) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = '有未保存的修改，确定要离开吗？';
        return '有未保存的修改，确定要离开吗？';
      }
    };

    const handlePopState = () => {
      if (isModified && onConfirmNavigation) {
        const confirmed = onConfirmNavigation();
        if (!confirmed) {
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModified, onConfirmNavigation]);
};