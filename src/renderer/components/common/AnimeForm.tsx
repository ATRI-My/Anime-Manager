import React, { useState, useEffect } from 'react';
import { WATCH_METHODS } from '../../../shared/constants';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';

interface AnimeFormData {
  title: string;
  watchMethod: string;
  description: string;
  tags: string[];
}

interface AnimeFormProps {
  onSubmit: (data: AnimeFormData) => void;
  initialData?: Partial<AnimeFormData> & { __isNew?: boolean };
  className?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  enableValidation?: boolean;
}

const AnimeForm: React.FC<AnimeFormProps> = ({
  onSubmit,
  initialData = {},
  className = '',
  onCancel,
  onDelete,
  enableValidation = true
}) => {
  const [formData, setFormData] = useState<AnimeFormData>({
    title: '',
    watchMethod: WATCH_METHODS[0],
    description: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [prevInitialData, setPrevInitialData] = useState<typeof initialData>();

  // 监听initialData变化，正确重置表单
  useEffect(() => {
    // 检查是否真的是切换了不同的番剧
    const isDifferentAnime = 
      initialData?.title !== prevInitialData?.title ||
      initialData?.watchMethod !== prevInitialData?.watchMethod ||
      initialData?.description !== prevInitialData?.description ||
      JSON.stringify(initialData?.tags || []) !== JSON.stringify(prevInitialData?.tags || []) ||
      initialData?.__isNew !== prevInitialData?.__isNew;

    if (isDifferentAnime) {
      // 重置表单为新番剧的数据
      if (initialData?.__isNew) {
        // 添加新番剧：重置为空表单
        setFormData({
          title: '',
          watchMethod: WATCH_METHODS[0],
          description: '',
          tags: [],
        });
      } else {
        // 编辑已有番剧：加载数据
        setFormData({
          title: initialData?.title || '',
          watchMethod: initialData?.watchMethod || WATCH_METHODS[0],
          description: initialData?.description || '',
          tags: initialData?.tags || [],
        });
      }
      setPrevInitialData(initialData);
    }
  }, [initialData, prevInitialData]);

  // 切换番剧时清空标签输入框
  useEffect(() => {
    setTagInput('');
  }, [initialData]);

  // 表单验证
  const { errors, validate } = useFormValidation(
    enableValidation ? {
      title: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: '番剧名称不能为空'
      },
      watchMethod: {
        required: true,
        validate: (value: string) => WATCH_METHODS.includes(value),
        message: '请选择有效的观看方式'
      },
      tags: {
        validate: (value: string[]) => value.length <= 10,
        message: '标签数量不能超过10个'
      }
    } : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enableValidation) {
      const isValid = validate(formData);
      if (!isValid) {
        return; // 验证失败，不提交
      }
    }
    
    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {enableValidation && <FormValidation errors={errors} />}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            番剧名称 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入番剧名称"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            观看方式 *
          </label>
          <select
            value={formData.watchMethod}
            onChange={(e) => setFormData({ ...formData, watchMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {WATCH_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入番剧描述（可选）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入标签后按Enter添加"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {formData.tags.length === 0 && (
              <span className="text-gray-500 text-sm">暂无标签</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            删除番剧
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          保存番剧
        </button>
      </div>
    </form>
  );
};

export default AnimeForm;