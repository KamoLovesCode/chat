
import React, { useState, useRef } from 'react';
import { ModelConfig, AppMode } from '../types';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File | null) => void;
  isLoading: boolean;
  models: ModelConfig[];
  selectedModel: ModelConfig;
  onSelectModel: (modelId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, models, selectedModel, onSelectModel }) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageMode = selectedModel.mode === AppMode.IMAGE;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const canSendMessage = (input.trim() || (file && !isImageMode)) && !isLoading;
    if (canSendMessage) {
      onSendMessage(input.trim(), isImageMode ? null : file);
      setInput('');
      removeFile();
    }
  };
  
  const placeholderText = isImageMode ? "Describe an image to generate..." : "Type your message...";

  return (
    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        <ModelSelector
            models={models}
            selectedModelId={selectedModel.id}
            onSelectModel={onSelectModel}
        />
        {filePreview && !isImageMode && (
          <div className="relative w-fit">
            <img src={filePreview} alt="Preview" className="h-24 w-auto rounded-lg" />
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-gray-300 dark:bg-gray-800 rounded-full p-1 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          {!isImageMode && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition duration-300 disabled:opacity-50"
                aria-label="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </>
          )}
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
            disabled={isLoading || (!input.trim() && (isImageMode || !file))}
            className="bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-full p-4 hover:bg-black dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-gray-400 transition duration-300 flex-shrink-0"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={isImageMode ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" : "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"} />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;