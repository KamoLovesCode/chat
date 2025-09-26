
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const WelcomeScreen: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center h-full text-left">
            <div className="max-w-4xl mx-auto w-full">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                        {t('welcome.title1')}
                    </span>
                    <br />
                    <span className="text-gray-900">{t('welcome.title2')}</span>
                </h1>
                <p className="text-gray-500 mb-10">
                    {t('welcome.subtitle')}
                </p>
            </div>
        </div>
    );
};
