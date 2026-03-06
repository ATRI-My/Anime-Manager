import React, { useState, useEffect } from 'react';
import QueryPage from './components/QueryPage/QueryPage';
import WritePage from './components/WritePage/WritePage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import { ToastProvider } from './contexts/ToastContext';
import { AppDataProvider, useAppDataContext } from './contexts/AppDataContext';
import ToastContainer from './components/common/ToastContainer';
import { initLogger } from './utils/logger';
import { useTranslation } from './hooks';

type TabType = 'query' | 'write' | 'settings';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('query');
  const { state } = useAppDataContext();
  const { t } = useTranslation();
  const theme = state.settings?.theme || 'light';
  const isDark = theme === 'dark';

  const tabs = [
    { id: 'query', label: t('app.tab.query'), component: <QueryPage /> },
    { id: 'write', label: t('app.tab.write'), component: <WritePage /> },
    { id: 'settings', label: t('app.tab.settings'), component: <SettingsPage /> },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-black text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <header className={isDark ? 'bg-neutral-950 shadow' : 'bg-white shadow'}>
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Anime Manager</h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('app.subtitle')}</p>
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Electron + React + TypeScript
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pt-6">
          <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? isDark
                          ? 'border-blue-400 text-white'
                          : 'border-blue-500 text-blue-600'
                        : isDark
                          ? 'border-transparent text-white/70 hover:text-white hover:border-gray-600'
                          : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
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
          <div className={isDark ? 'bg-neutral-900 rounded-lg shadow' : 'bg-white rounded-lg shadow'}>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </main>

        <footer
          className={`px-8 py-6 mt-8 text-center text-sm border-t ${
            isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'
          }`}
        >
          <p>{t('app.footer.copyright')}</p>
          <p className="mt-1">
            {t('app.footer.versionAndTab', { tab: tabs.find(tab => tab.id === activeTab)?.label ?? '' })}
          </p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // 初始化日志系统
  useEffect(() => {
    initLogger();
  }, []);

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