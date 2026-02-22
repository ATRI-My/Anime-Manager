import React from 'react';
import ReactDOM from 'react-dom/client';
import { HighlightText } from './src/renderer/components/common';

const TestApp = () => {
  const testCases = [
    {
      text: '这是一个测试文本，用于测试高亮功能。',
      highlight: '测试',
      description: '基本高亮测试'
    },
    {
      text: 'Hello World! This is a test.',
      highlight: 'test',
      description: '不区分大小写测试'
    },
    {
      text: '正则表达式特殊字符 .*+?^${}()|[]\\',
      highlight: '.',
      description: '特殊字符转义测试'
    },
    {
      text: '没有匹配的文本',
      highlight: '不存在的',
      description: '无匹配测试'
    },
    {
      text: '空高亮字符串',
      highlight: '',
      description: '空高亮测试'
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">HighlightText 组件测试</h1>
      
      {testCases.map((testCase, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">{testCase.description}</h3>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">
              文本: <span className="font-mono">{testCase.text}</span>
            </div>
            <div className="text-sm text-gray-600">
              高亮: <span className="font-mono">{testCase.highlight || '(空)'}</span>
            </div>
            <div className="mt-2 p-2 bg-gray-50 rounded">
              结果: <HighlightText 
                text={testCase.text} 
                highlight={testCase.highlight}
                className="text-base"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<TestApp />);