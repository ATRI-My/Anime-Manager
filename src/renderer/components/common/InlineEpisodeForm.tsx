import React, { useState, useRef, useEffect } from 'react';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';
import { useTheme, useTranslation } from '../../hooks';

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
  const { isDark, text, input } = useTheme();
  const { t } = useTranslation();
  
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
        message: t('episode.validation.numberRequired')
      },
      title: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: t('episode.validation.titleRequired')
      },
      url: {
        required: true,
        validate: (value: string) => value.trim().length > 0,
        message: t('episode.validation.urlRequired')
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
          <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
            {t('episode.numberLabel')}
          </label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
            min="1"
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
            {t('episode.titleLabel')}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            ref={titleInputRef}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
            placeholder={t('episode.titlePlaceholder')}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
            {t('episode.urlLabel')}
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
            placeholder={t('episode.urlPlaceholder')}
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="watched"
              checked={formData.watched}
              onChange={handleChange}
              className={`rounded text-blue-600 focus:ring-blue-500 ${isDark ? 'border-gray-600 bg-neutral-800' : 'border-gray-300'}`}
            />
            <span className={`text-sm font-medium ${text.secondary}`}>{t('episode.watched')}</span>
          </label>
        </div>
        
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-1 ${text.secondary}`}>
            {t('episode.notesLabel')}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${input.base} ${input.focus}`}
            placeholder={t('episode.notesPlaceholder')}
          />
        </div>
      </div>
      
      {enableValidation && <FormValidation errors={errors} />}
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? t('episode.submitUpdate') : t('episode.submitAdd')}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${isDark ? 'bg-neutral-700 text-gray-200 hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {t('episode.reset')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${isDark ? 'bg-neutral-700 text-gray-200 hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {t('anime.cancel')}
          </button>
        )}
        
        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('episode.delete')}
          </button>
        )}
      </div>
    </form>
  );
};

export default InlineEpisodeForm;
export type { EpisodeFormData };