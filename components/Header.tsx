import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 shadow-lg sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Kamocodes
          </h1>
          <p className="text-sm text-gray-500">Your AI Web Development Partner</p>
        </div>
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;