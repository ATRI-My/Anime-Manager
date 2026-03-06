import { useAppDataContext } from '../contexts/AppDataContext';

export const useTheme = () => {
  const { state } = useAppDataContext();
  const theme = state.settings?.theme || 'light';
  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    // 常用的主题类名
    bg: {
      primary: isDark ? 'bg-neutral-900' : 'bg-white',
      secondary: isDark ? 'bg-neutral-800' : 'bg-gray-50',
      tertiary: isDark ? 'bg-neutral-950' : 'bg-gray-100',
      hover: isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-50',
      card: isDark ? 'bg-neutral-800' : 'bg-white',
      cardFooter: isDark ? 'bg-neutral-900' : 'bg-gray-50',
    },
    text: {
      primary: isDark ? 'text-gray-50' : 'text-gray-900',
      secondary: isDark ? 'text-gray-200' : 'text-gray-600',
      tertiary: isDark ? 'text-gray-300' : 'text-gray-500',
      muted: isDark ? 'text-gray-300' : 'text-gray-400',
      link: isDark ? 'text-blue-400' : 'text-blue-600',
      linkHover: isDark ? 'hover:text-blue-300' : 'hover:text-blue-800',
    },
    border: {
      primary: isDark ? 'border-gray-600' : 'border-gray-300',
      secondary: isDark ? 'border-gray-700' : 'border-gray-200',
      light: isDark ? 'border-gray-800' : 'border-gray-100',
    },
    input: {
      base: isDark 
        ? 'bg-neutral-800 border-gray-600 text-gray-50 placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
      focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    },
    icon: {
      primary: isDark ? 'text-gray-300' : 'text-gray-400',
      hover: isDark ? 'hover:text-gray-100' : 'hover:text-gray-600',
    },
    tag: {
      base: isDark ? 'bg-neutral-700 text-gray-200' : 'bg-gray-100 text-gray-700',
    },
  };
};
