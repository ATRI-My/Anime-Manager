import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  validate?: (value: any) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface UseFormValidationResult {
  errors: string[];
  validate: (data: Record<string, any>) => boolean;
  clearErrors: () => void;
}

const useFormValidation = (rules?: ValidationRules): UseFormValidationResult => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback((data: Record<string, any>): boolean => {
    if (!rules) {
      return true;
    }

    const newErrors: string[] = [];

    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      
      // 检查必填字段
      if (rule.required) {
        if (value === undefined || value === null || value === '') {
          newErrors.push(rule.message);
          return;
        }
      }

      // 检查数组类型的必填字段
      if (rule.required && Array.isArray(value) && value.length === 0) {
        newErrors.push(rule.message);
        return;
      }

      // 执行自定义验证
      if (rule.validate && value !== undefined && value !== null && value !== '') {
        const isValid = rule.validate(value);
        if (!isValid) {
          newErrors.push(rule.message);
        }
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [rules]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validate,
    clearErrors
  };
};

export default useFormValidation;