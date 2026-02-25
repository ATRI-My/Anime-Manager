import React, { useEffect } from 'react';
import EpisodeForm from './EpisodeForm';
import { Episode } from '../../../shared/types';

interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  episode?: Episode | null;
  animeTitle?: string;
  onDelete?: () => void;
}

const EpisodeModal: React.FC<EpisodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  episode,
  animeTitle,
  onDelete
}) => {
  // 当模态框打开时，记录日志
  useEffect(() => {
    if (isOpen) {
      console.log('EpisodeModal: 模态框打开，episode =', episode?.id || 'new');
    }
  }, [isOpen, episode]);
  
  if (!isOpen) return null;

  const handleSubmit = async (formData: any) => {
    await onSubmit(formData);
    // 注意：onSubmit应该负责关闭模态框
    // 这里不调用onClose，让调用者决定何时关闭
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  console.log('EpisodeModal: 渲染，isOpen =', isOpen, 'episode =', episode?.id);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div 
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            <span className="sr-only">关闭</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {episode ? '编辑剧集' : '添加新剧集'}
          </h3>
          {animeTitle && (
            <p className="mt-1 text-sm text-gray-500">
              所属番剧：{animeTitle}
            </p>
          )}
          
           <div className="mt-6">
             <EpisodeForm
               key={`episode-form-${isOpen}-${episode?.id || 'new'}`}
               onSubmit={handleSubmit}
               initialData={episode || undefined}
               onCancel={onClose}
               onDelete={episode ? handleDelete : undefined}
               enableValidation={true}
               isOpen={isOpen}
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeModal;