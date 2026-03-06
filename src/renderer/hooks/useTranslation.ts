import { useAppDataContext } from '../contexts/AppDataContext';
import { getTranslation, type TranslationKey } from '../i18n/translations';
import type { Locale } from '../../shared/types';

export function useTranslation() {
  const { state } = useAppDataContext();
  const locale: Locale = state.settings?.language ?? 'zh-CN';

  const t = (key: TranslationKey, params?: Record<string, string>) => {
    return getTranslation(locale, key, params);
  };

  return { t, locale };
}
