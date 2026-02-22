import React from 'react';
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
  if (!isOpen) return null;

  const handleSubmit = (formData: any) => {
    onSubmit(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* 模态框定位 */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* 模态框内容 */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
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
                  onSubmit={handleSubmit}
                  initialData={episode || undefined}
                  onCancel={onClose}
                  onDelete={episode ? handleDelete : undefined}
                  enableValidation={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeModal;