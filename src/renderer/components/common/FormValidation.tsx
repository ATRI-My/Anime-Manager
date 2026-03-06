import React from 'react';
import { useTheme, useTranslation } from '../../hooks';

interface FormValidationProps {
  errors: string[];
  className?: string;
}

const FormValidation: React.FC<FormValidationProps> = ({ errors, className = '' }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  if (errors.length === 0) {
    return null;
  }

  return (
    <div 
      className={`rounded-md p-4 mb-6 border ${className} ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}
      data-testid="error-list"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${isDark ? 'text-red-200' : 'text-red-800'}`}>
            {t('validation.errorsCount', { count: String(errors.length) })}
          </h3>
          <div className={`mt-2 text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormValidation;