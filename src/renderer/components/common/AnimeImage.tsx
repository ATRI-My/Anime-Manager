import React, { useState, useEffect } from 'react';

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
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      if (!imagePath) return;

      const result = await window.electronAPI.readImageData?.(imagePath);
      if (!cancelled) {
        if (result) {
          setDataUrl(result);
        }
      }
    };

    setDataUrl(null);
    setError(false);
    loadImage();

    return () => {
      cancelled = true;
    };
  }, [imagePath]);

  if (!dataUrl || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-gray-500 ${className}`}
        style={{ minHeight }}
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
        alt="anime cover"
        onError={() => setError(true)}
        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
};

export default AnimeImage;
