import React, { useMemo, useCallback } from 'react';
import { Anime } from '../../../shared/types';
import AnimeCard from './AnimeCard';

interface VirtualAnimeGridProps {
  animeList: Anime[];
  onSelect?: (anime: Anime) => void;
  onEdit?: (anime: Anime) => void;
  onDelete?: (anime: Anime) => void;
  className?: string;
  columns?: number;
  gap?: number;
  itemHeight?: number;
  overscan?: number;
}

const VirtualAnimeGrid: React.FC<VirtualAnimeGridProps> = ({
  animeList,
  onSelect,
  onEdit,
  onDelete,
  className = '',
  columns = 3,
  gap = 4,
  itemHeight = 400,
  overscan = 2
}) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);

  const handleScroll = useCallback(() => {
    if (gridRef.current) {
      setScrollTop(gridRef.current.scrollTop);
    }
  }, []);

  React.useEffect(() => {
    const element = gridRef.current;
    if (element) {
      setViewportHeight(element.clientHeight);
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(animeList.length / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.max(startRow, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan)
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < animeList.length) {
          items.push({
            anime: animeList[index],
            row,
            col
          });
        }
      }
    }
    return items;
  }, [animeList, startRow, endRow, columns]);

  return (
    <div
      ref={gridRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: '100%' }}
    >
      <div
        className="relative"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ anime, row, col }) => (
          <div
            key={anime.id}
            className="absolute"
            style={{
              top: row * rowHeight,
              left: `calc(${(col * 100) / columns}% + ${(col * gap) / columns}px)`,
              width: `calc(${100 / columns}% - ${((columns - 1) * gap) / columns}px)`,
              height: itemHeight,
              marginRight: gap,
              marginBottom: gap
            }}
          >
            <AnimeCard
              anime={anime}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualAnimeGrid;