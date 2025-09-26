
import React, { useState } from 'react';
import { ModelConfig, AppMode } from '../types';
import ModeSelector from './ModelSelector';
import WebEditorInput from './WebEditorInput';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  models: ModelConfig[];
  selectedModeConfig: ModelConfig;
  onSelectMode: (modelId: string) => void;
  selectedModelName: string;
  onSelectModelName: (modelName: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onFileImport: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  models, 
  selectedModeConfig, 
  onSelectMode,
  selectedModelName,
  onSelectModelName,
  code,
  onCodeChange,
  onFileImport
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const placeholderText = selectedModeConfig.mode === AppMode.IMAGE 
    ? "Describe an image to generate..." 
    : "Type your message...";

  const availableModels = selectedModeConfig.availableModels || [];

  return (
    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ModeSelector
                models={models}
                selectedModeId={selectedModeConfig.id}
                onSelectMode={onSelectMode}
            />
          </div>
          <div className="flex-1">
             <select
              value={selectedModelName}
              onChange={(e) => onSelectModelName(e.target.value)}
              disabled={isLoading || availableModels.length < 2}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-3 px-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              aria-label="Select a model"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedModeConfig.mode === AppMode.WEB_EDITOR ? (
          <WebEditorInput 
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            code={code}
            onCodeChange={onCodeChange}
            onFileImport={onFileImport}
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholderText}
              disabled={isLoading}
              className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-4 px-6 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-full p-4 hover:bg-black dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-gray-400 transition duration-300 flex-shrink-0"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d={selectedModeConfig.mode === AppMode.IMAGE ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" : "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"} />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatInput;