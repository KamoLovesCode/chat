
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { translations, languages, LanguageKey } from '../translations';

type TranslateFunction = (key: string, replacements?: Record<string, string>) => string;

export interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  t: TranslateFunction;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageKey>('en');

  const t: TranslateFunction = useCallback((key, replacements) => {
    let translation = translations[language][key] || translations.en[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([keyToReplace, value]) => {
            translation = translation.replace(`{${keyToReplace}}`, value);
        });
    }
    return translation;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
