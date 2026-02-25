import React, { useState, useRef, useEffect } from 'react';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';

interface EpisodeFormData {
  number: number;
  title: string;
  url: string;
  watched: boolean;
  notes?: string;
}

interface InlineEpisodeFormProps {
  onSubmit: (data: EpisodeFormData) => void;
  initialData?: Partial<EpisodeFormData>;
  onCancel?: () => void;
  onDelete?: () => void;
  enableValidation?: boolean;
  isEditing?: boolean;
  className?: string;
}

const InlineEpisodeForm: React.FC<InlineEpisodeFormProps> = ({
  onSubmit,
  initialData = {},
  className = '',
  onCancel,
  onDelete,
  enableValidation = true,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<EpisodeFormData>({
    number: initialData?.number ?? 1,
    title: initialData?.title ?? '',
    url: initialData?.url ?? '',
    watched: initialData?.watched ?? false,
    notes: initialData?.notes ?? '',
  });
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // 尽可能强地保证标题输入框可用且获得焦点（兼容删除后焦点异常的情况）
  useEffect(() => {
    const focusTitleInput = () => {
      if (titleInputRef.current) {
        // 防御性：如果被异常标记为 disabled，则恢复
        if (titleInputRef.current.disabled) {
          titleInputRef.current.disabled = false;
        }
        titleInputRef.current.focus();
        // 多数情况下选中文本，方便连续输入
        titleInputRef.current.select();
      }
    };

    // 挂载后短延时聚焦一次，处理初次打开
    const timer = window.setTimeout(focusTitleInput, 50);

    // 当窗口重新获得焦点时，再尝试一次聚焦
    window.addEventListener('focus', focusTitleInput);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', focusTitleInput);
    };
  }, []);
  
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
      number: initialData?.number ?? 1,
      title: initialData?.title ?? '',
      url: initialData?.url ?? '',
      watched: initialData?.watched ?? false,
      notes: initialData?.notes ?? '',
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            剧集编号 *
          </label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            剧集标题 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            ref={titleInputRef}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入剧集标题"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            剧集链接 *
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/episode-1"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="watched"
              checked={formData.watched}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">已观看</span>
          </label>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            备注
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="可选备注信息"
          />
        </div>
      </div>
      
      {enableValidation && <FormValidation errors={errors} />}
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? '更新' : '添加'}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          重置
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            取消
          </button>
        )}
        
        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            删除
          </button>
        )}
      </div>
    </form>
  );
};

export default InlineEpisodeForm;
export type { EpisodeFormData };