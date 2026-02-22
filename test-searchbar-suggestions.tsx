import React, { useState } from 'react';
import SearchBar from './src/renderer/components/common/SearchBar';

const TestSearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  
  // 模拟建议数据
  const mockSuggestions = [
    '进击的巨人',
    '进击的巨人 最终季',
    '进击的巨人 剧场版',
    '鬼灭之刃',
    '鬼灭之刃 无限列车篇',
    '鬼灭之刃 游郭篇',
    '咒术回战',
    '咒术回战 第二季',
    '间谍过家家',
    '间谍过家家 第二季'
  ];

  const handleSearch = (query: string) => {
    console.log('搜索查询:', query);
    setSearchQuery(query);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    console.log('选择了建议:', suggestion);
    setSelectedSuggestion(suggestion);
  };

  // 过滤建议，只显示包含搜索词的
  const filteredSuggestions = mockSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SearchBar 建议功能测试</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">增强版 SearchBar</h2>
        <SearchBar
          placeholder="搜索动漫名称..."
          onSearch={handleSearch}
          suggestions={filteredSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
        />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">当前搜索词:</h3>
          <p className="text-gray-700">{searchQuery || '暂无搜索词'}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">选择的建议:</h3>
          <p className="text-gray-700">{selectedSuggestion || '未选择建议'}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">可用建议 ({filteredSuggestions.length} 个):</h3>
          <ul className="space-y-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestSearchBar;