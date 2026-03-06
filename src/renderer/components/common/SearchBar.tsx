import React, { useState, useEffect, useRef } from 'react';
import HighlightText from './HighlightText';
import { useTheme, useTranslation } from '../../hooks';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceDelay?: number;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  onSearch,
  className = '',
  debounceDelay = 300,
  suggestions = [],
  onSuggestionSelect
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { isDark, input, bg, text, border, icon } = useTheme();
  const { t } = useTranslation();
  const placeholderText = placeholder ?? t('search.placeholder');

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay, onSearch]);

  // 点击外部关闭建议下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const handleInputFocus = () => {
    if (query.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchBarRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleInputFocus}
          placeholder={placeholderText}
          className={`w-full pl-12 pr-12 py-3 border rounded-lg ${input.base} ${input.focus}`}
        />
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${icon.primary}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${icon.primary} ${icon.hover}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 ${bg.card} ${border.primary} border rounded-lg shadow-lg max-h-60 overflow-y-auto`}>
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-2 text-left ${bg.hover} focus:outline-none`}
                >
                  <HighlightText
                    text={suggestion}
                    highlight={query}
                    className={text.primary}
                    highlightClassName={isDark ? 'bg-yellow-600 text-gray-900 font-medium' : 'bg-yellow-200 font-medium'}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;