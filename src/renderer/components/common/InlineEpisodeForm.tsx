import React, { useState, useRef, useEffect } from 'react';
import FormValidation from './FormValidation';
import useFormValidation from '../../hooks/useFormValidation';
import { Episode } from '../../../shared/types';

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
    number: initialData.number || 1,
    title: initialData.title || '',
    url: initialData.url || '',
    watched: initialData.watched || false,
    notes: initialData.notes || '',
  });
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
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
      number: initialData.number || 1,
      title: initialData.title || '',
      url: initialData.url || '',
      watched: initialData.watched || false,
      notes: initialData.notes || '',
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* 表单内容将在后续步骤添加 */}
    </form>
  );
};

export default InlineEpisodeForm;