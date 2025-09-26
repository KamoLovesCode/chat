
import React, { useState, useRef } from 'react';

interface WebEditorInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  code: string;
  onCodeChange: (code: string) => void;
  onFileImport: (file: File) => void;
}

const WebEditorInput: React.FC<WebEditorInputProps> = ({ 
    onSendMessage, 
    isLoading,
    code,
    onCodeChange,
    onFileImport 
}) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/html') {
      onFileImport(selectedFile);
    } else if (selectedFile) {
        alert('Please select an HTML file.');
    }
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendMessage(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Import or paste your HTML code here..."
          disabled={isLoading}
          className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50 resize-y"
          aria-label="Code editor"
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".html"
        />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
            aria-label="Import HTML file"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
        </button>
      </div>
       <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the changes you want to make..."
              disabled={isLoading || !code}
              className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-4 px-6 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 disabled:opacity-50"
              aria-label="Change request input"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim() || !code}
              className="bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-full p-4 hover:bg-black dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-gray-400 transition duration-300 flex-shrink-0"
              aria-label="Generate code changes"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1V2M8 7l2 1M8 7l2-1M8 7v2.5M12 22V9.25m8.5 12.5l-2.25-2.25M3.5 14.5l2.25 2.25m0 0l2.25 2.25M5.75 16.75l2.25-2.25M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </button>
          </form>
    </div>
  );
};

export default WebEditorInput;
