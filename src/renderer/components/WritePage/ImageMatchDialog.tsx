import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Anime } from '../../../shared/types';
import { useTheme } from '../../hooks';

interface ImageMatchDialogProps {
  animeList: Anime[];
  onClose: () => void;
  onApply: (matches: Map<string, string>) => void;
}

interface ImageFile {
  fileName: string;
  nameWithoutExt: string;
}

const ImageMatchDialog: React.FC<ImageMatchDialogProps> = ({ animeList, onClose, onApply }) => {
  const { isDark } = useTheme();
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const folderSeqRef = useRef(0);
  const animeListRef = useRef(animeList);
  animeListRef.current = animeList;

  const doMatch = (files: ImageFile[]) => {
    const newMatches = new Map<string, string>();
    const availableFiles = new Map(files.map(f => [f.nameWithoutExt, f.fileName]));
    const list = animeListRef.current;

    for (const anime of list) {
      const aname = anime.title.toLowerCase();
      for (const [nameWithoutExt, fileName] of availableFiles) {
        if (nameWithoutExt.toLowerCase() === aname) {
          newMatches.set(anime.id, fileName);
          availableFiles.delete(nameWithoutExt);
          break;
        }
      }
    }

    for (const anime of list) {
      if (newMatches.has(anime.id)) continue;
      const aname = anime.title.toLowerCase();
      for (const [nameWithoutExt, fileName] of availableFiles) {
        const fname = nameWithoutExt.toLowerCase();
        if (aname.includes(fname) || fname.includes(aname)) {
          newMatches.set(anime.id, fileName);
          availableFiles.delete(nameWithoutExt);
          break;
        }
      }
    }

    setMatches(newMatches);
    setLoading(false);
    setError(null);
  };

  const initFolder = async () => {
    folderSeqRef.current += 1;
    const seq = folderSeqRef.current;
    try {
      const folder = await window.electronAPI.pickImageFolder?.();
      if (!folder) {
        onClose();
        return;
      }
      if (seq !== folderSeqRef.current) return;
      setFolderPath(folder);
      const files = await window.electronAPI.scanImageFolder?.(folder) || [];
      if (seq !== folderSeqRef.current) return;
      setImageFiles(files);
      doMatch(files);
    } catch {
      if (seq !== folderSeqRef.current) return;
      setLoading(false);
      setError('扫描失败，请重试');
    }
  };

  useEffect(() => {
    initFolder();
  }, []);

  const handleChangeMatch = (animeId: string, fileName: string) => {
    setMatches(prev => {
      const next = new Map(prev);
      if (fileName === '__none__') {
        next.delete(animeId);
      } else {
        next.set(animeId, fileName);
      }
      return next;
    });
  };

  const handleChangeFolder = async () => {
    setError(null);
    folderSeqRef.current += 1;
    const seq = folderSeqRef.current;
    try {
      const folder = await window.electronAPI.pickImageFolder?.();
      if (!folder) return;
      if (seq !== folderSeqRef.current) return;
      setFolderPath(folder);
      setLoading(true);
      const files = await window.electronAPI.scanImageFolder?.(folder) || [];
      if (seq !== folderSeqRef.current) return;
      setImageFiles(files);
      doMatch(files);
    } catch {
      if (seq !== folderSeqRef.current) return;
      setLoading(false);
      setError('扫描失败，请重试');
    }
  };

  const matchedCount = matches.size;
  const totalAnime = animeList.length;
  const unmatchedAnimeCount = totalAnime - matchedCount;

  const unmatchedImagesCount = useMemo(() => {
    const matchedFileNames = new Set(matches.values());
    return imageFiles.filter(f => !matchedFileNames.has(f.fileName)).length;
  }, [imageFiles, matches]);

  const handleConfirm = () => {
    const pathMatches = new Map<string, string>();
    const folder = folderPath || '';
    for (const [animeId, fileName] of matches) {
      pathMatches.set(animeId, `${folder}/${fileName}`);
    }
    onApply(pathMatches);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className={`rounded-lg shadow-xl p-8 ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
          {error ? (
            <div className="text-center">
              <p className={`text-red-500 mb-4`}>扫描失败，请重试</p>
              <button
                onClick={initFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                重试
              </button>
            </div>
          ) : (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
              <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>扫描文件夹中...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col ${isDark ? 'bg-neutral-800' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>导入匹配封面</h2>
          <button onClick={onClose} className={`p-1 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>扫描文件夹: {folderPath}</span>
            <button onClick={handleChangeFolder} className="px-2 py-1 text-blue-600 hover:text-blue-800 text-xs">
              更换文件夹
            </button>
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            匹配到 {matchedCount} / {totalAnime} 部番剧
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6">
          <table className={`w-full text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left py-2 font-medium">番剧名</th>
                <th className="text-left py-2 font-medium">匹配的图片文件</th>
                <th className="text-left py-2 font-medium w-16">状态</th>
              </tr>
            </thead>
            <tbody>
              {animeList.map(anime => {
                const matched = matches.get(anime.id);
                const hasMatch = !!matched;
                const takenByOthers = new Set(
                  Array.from(matches.entries())
                    .filter(([id]) => id !== anime.id)
                    .map(([, fn]) => fn)
                );
                const availableOptions = imageFiles.filter(
                  f => !takenByOthers.has(f.fileName)
                );
                return (
                  <tr key={anime.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`py-2 ${hasMatch ? '' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                      {anime.title}
                    </td>
                    <td className="py-2">
                      <select
                        className={`text-sm rounded border px-2 py-1 ${isDark ? 'bg-neutral-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'}`}
                        value={matched || '__none__'}
                        onChange={e => handleChangeMatch(anime.id, e.target.value)}
                      >
                        <option value="__none__">手动选择...</option>
                        {matched && (
                          <option value={matched}>{matched} ✓</option>
                        )}
                        {availableOptions
                          .filter(f => f.fileName !== matched)
                          .map(f => (
                            <option key={f.fileName} value={f.fileName}>{f.fileName}</option>
                          ))
                        }
                      </select>
                    </td>
                    <td className="py-2">
                      {hasMatch ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            未匹配番剧: {unmatchedAnimeCount}部 | 未匹配图片: {unmatchedImagesCount}张
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded text-sm ${isDark ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMatchDialog;
