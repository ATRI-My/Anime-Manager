import React, { useState } from 'react';
import { Episode as SharedEpisode } from '../../../shared/types';

interface EpisodeTableProps {
  episodes: SharedEpisode[];
  onAddEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
  className?: string;
}

const EpisodeTable: React.FC<EpisodeTableProps> = ({
  episodes,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  className = ''
}) => {
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectEpisode = (episodeId: string) => {
    if (selectedEpisodes.includes(episodeId)) {
      setSelectedEpisodes(selectedEpisodes.filter(id => id !== episodeId));
    } else {
      setSelectedEpisodes([...selectedEpisodes, episodeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEpisodes([]);
    } else {
      setSelectedEpisodes(episodes.map(ep => ep.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = () => {
    if (selectedEpisodes.length === 0) {
      alert('请先选择要删除的剧集');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedEpisodes.length} 个剧集吗？`)) {
      selectedEpisodes.forEach(id => onDeleteEpisode(id));
      setSelectedEpisodes([]);
      setSelectAll(false);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              全选 ({selectedEpisodes.length}/{episodes.length})
            </span>
          </div>
          
          {selectedEpisodes.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                批量删除
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          共 {episodes.length} 个剧集
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                集数
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                链接
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                观看状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {episodes.map((episode) => (
              <tr key={episode.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEpisodes.includes(episode.id)}
                    onChange={() => handleSelectEpisode(episode.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">第{episode.number}话</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{episode.title}</div>
                </td>
                 <td className="px-6 py-4">
                   <div className="text-sm text-gray-500 truncate max-w-2xl">{episode.url}</div>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${episode.watched ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {episode.watched ? '已观看' : '未观看'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEditEpisode(episode.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => onDeleteEpisode(episode.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {episodes.length === 0 && (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无剧集数据</h3>
          <p className="mt-1 text-sm text-gray-500">请先添加剧集数据。</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          已选择 {selectedEpisodes.length} 个剧集
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onAddEpisode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加新行
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeTable;