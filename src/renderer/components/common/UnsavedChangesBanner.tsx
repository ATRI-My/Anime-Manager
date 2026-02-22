import React from 'react';

interface UnsavedChangesBannerProps {
  isModified: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}

const UnsavedChangesBanner: React.FC<UnsavedChangesBannerProps> = ({
  isModified,
  onSave,
  onDiscard
}) => {
  if (!isModified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="w-5 h-5 text-yellow-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            有未保存的修改。请保存以防止数据丢失。
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={onSave}
              className="bg-yellow-500 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              立即保存
            </button>
            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                className="ml-3 text-yellow-700 bg-transparent px-3 py-1.5 text-sm font-medium rounded-md hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                放弃修改
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesBanner;