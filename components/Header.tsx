
import React from 'react';
import { GeminiIcon, GlobeIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';
import { languages, LanguageKey } from '../translations';

interface HeaderProps {
    onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
    const { t, language, setLanguage } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as LanguageKey);
        onNewChat(); // Start a new chat session in the new language
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GeminiIcon className="w-6 h-6" />
                    <h1 className="text-xl font-semibold text-gray-800">kamocodes.xyz</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center">
                         <GlobeIcon className="w-5 h-5 text-gray-500 absolute left-3 pointer-events-none" />
                         <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="appearance-none bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            aria-label="Select language"
                        >
                            {(Object.keys(languages) as LanguageKey[]).map(langKey => (
                                <option key={langKey} value={langKey}>
                                    {languages[langKey].name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={onNewChat}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('header.newChat')}
                    </button>
                </div>
            </div>
        </header>
    );
};