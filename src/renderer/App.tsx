import React, { useState } from 'react';
import QueryPage from './components/QueryPage/QueryPage';
import WritePage from './components/WritePage/WritePage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import { ToastProvider } from './contexts/ToastContext';
import { AppDataProvider } from './contexts/AppDataContext';
import ToastContainer from './components/common/ToastContainer';

type TabType = 'query' | 'write' | 'settings';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('query');

  const tabs = [
    { id: 'query', label: '查询', component: <QueryPage /> },
    { id: 'write', label: '写入', component: <WritePage /> },
    { id: 'settings', label: '设置', component: <SettingsPage /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Anime Manager</h1>
                <p className="text-gray-600 mt-1">动漫资源管理器桌面应用</p>
              </div>
              <div className="text-sm text-gray-500">
                Electron + React + TypeScript
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <main className="px-8 py-6">
          <div className="bg-white rounded-lg shadow">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </main>

        <footer className="px-8 py-6 mt-8 text-center text-gray-500 text-sm border-t border-gray-200">
           <p>© 2026 Anime Manager. 使用 Electron 构建的桌面应用。</p>
          <p className="mt-1">版本 1.0.0 | 当前标签: {tabs.find(t => t.id === activeTab)?.label}</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppDataProvider>
      <ToastProvider>
        <ToastContainer />
        <AppContent />
      </ToastProvider>
    </AppDataProvider>
  );
};

export default App;