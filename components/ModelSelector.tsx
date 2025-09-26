
import React, { useState, useRef, useEffect } from 'react';
import { ModelConfig } from '../types';

interface ModeSelectorProps {
  models: ModelConfig[];
  selectedModeId: string;
  onSelectMode: (modelId: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ models, selectedModeId, onSelectMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedMode = models.find(m => m.id === selectedModeId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (modelId: string) => {
    onSelectMode(modelId);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-3 px-4 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedMode?.name || 'Select a mode'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 animate-fade-in-up transition-colors duration-300">
          <ul role="listbox" className="py-1">
            {models.map(model => (
              <li key={model.id} role="option" aria-selected={model.id === selectedModeId}>
                <button
                  onClick={() => handleSelect(model.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {model.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;