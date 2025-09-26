import React from 'react';

interface FollowUpPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const FollowUpPrompts: React.FC<FollowUpPromptsProps> = ({ prompts, onPromptClick }) => {
  return (
    <div className="flex flex-wrap justify-start items-center gap-2 mt-4 ml-11 animate-fade-in">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default FollowUpPrompts;
