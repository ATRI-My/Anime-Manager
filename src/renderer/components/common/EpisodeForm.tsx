import React, { useState } from 'react';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';

interface EpisodeFormData {
  number: number;
  title: string;
  url: string;
  watched: boolean;
  notes?: string;
}

interface EpisodeFormProps {
  onSubmit: (data: EpisodeFormData) => void;
  initialData?: Partial<EpisodeFormData>;
  className?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  enableValidation?: boolean;
}

const EpisodeForm: React.FC<EpisodeFormProps> = ({
  onSubmit,
  initialData = {},
  className = '',
  onCancel,
  onDelete,
  enableValidation = true
}) => {
  const [formData, setFormData] = useState<EpisodeFormData>({
    number: initialData.number || 1,
    title: initialData.title || '',
    url: initialData.url || '',
    watched: initialData.watched || false,
    notes: initialData.notes || '',
  });

  // 表单验证
  const { errors, validate } = useFormValidation(
    enableValidation ? {
      number: {
        required: true,
        validate: (value: number) => value > 0,
        message: '剧集编号必须大于0'
      },
      title: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: '剧集标题不能为空'
      },
      url: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: '剧集链接不能为空'
      }
    } : {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'number') {
      const numValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 1 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enableValidation) {
      const isValid = validate(formData);
      if (!isValid) {
        return;
      }
    }
    
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      number: initialData.number || 1,
      title: initialData.title || '',
      url: initialData.url || '',
      watched: initialData.watched || false,
      notes: initialData.notes || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* 显示表单验证错误 */}
      {errors.length > 0 && (
        <div className="mb-4">
          <FormValidation errors={errors} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 剧集编号 */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
            剧集编号 *
          </label>
           <input
             type="number"
             id="number"
             name="number"
             value={formData.number}
             onChange={handleChange}
             min="1"
             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             required
             autoFocus
           />
          <p className="mt-1 text-sm text-gray-500">剧集的顺序编号，必须大于0</p>
        </div>

        {/* 观看状态 */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="watched"
              name="watched"
              checked={formData.watched}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="watched" className="font-medium text-gray-700">
              已观看
            </label>
            <p className="text-gray-500">标记此剧集是否已观看</p>
          </div>
        </div>
      </div>

      {/* 剧集标题 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          剧集标题 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="例如：第一话 觉醒"
          required
        />
        <p className="mt-1 text-sm text-gray-500">剧集的标题或名称</p>
      </div>

      {/* 剧集链接 */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          剧集链接 *
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="例如：https://example.com/episode1 或 file:///path/to/episode.mp4"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          播放链接，可以是URL或本地文件路径。支持：http/https链接、本地文件路径(file://)、磁力链接(magnet:)
        </p>
      </div>

      {/* 备注 */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          备注（可选）
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="添加关于此剧集的备注信息"
        />
        <p className="mt-1 text-sm text-gray-500">可选的备注信息，如特殊说明、观看记录等</p>
      </div>

      {/* 按钮组 */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            重置
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              删除
            </button>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {initialData.title ? '更新剧集' : '添加剧集'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EpisodeForm;