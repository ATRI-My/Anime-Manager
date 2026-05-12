import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks';

interface AnimeImageProps {
  imagePath?: string;
  className?: string;
  minHeight?: string;
}

const AnimeImage: React.FC<AnimeImageProps> = ({
  imagePath,
  className = '',
  minHeight = '120px',
}) => {
  const { isDark } = useTheme();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setDataUrl(null);
    setError(false);

    if (!imagePath) return;

    window.electronAPI.readImageData?.(imagePath)
      .then((result) => {
        if (!cancelled) {
          if (result) {
            setDataUrl(result);
            setError(false);
          } else {
            console.warn('[AnimeImage] 读取图片失败，路径:', imagePath);
            setError(true);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[AnimeImage] 读取图片异常，路径:', imagePath, err);
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [imagePath]);

  if (!dataUrl || error) {
    return (
      <div
        className={`flex items-center justify-center ${isDark ? 'bg-neutral-700 text-gray-500' : 'bg-gray-100 text-gray-400'} ${className}`}
        style={{ minHeight }}
        title={imagePath || '无封面图片'}
      >
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={dataUrl}
        alt=""
        className="w-full h-auto object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default AnimeImage;
