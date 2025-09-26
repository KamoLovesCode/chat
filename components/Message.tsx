
import React, { useState } from 'react';
import { ChatMessage, MessageRole, AppMode } from '../types';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageProps {
  message: ChatMessage;
  onAddToPage: (content: string, type: 'text' | 'image') => void;
  currentMode: AppMode;
}

const TRUNCATION_LENGTH = 750;

const KAMO_ICON_BASE64 = "data:image/jpeg;base64,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RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH5seKP+Rj1X/r8m/wDQzWdWj4o/5GPVf+vyb/0M1nV/S+G/gw9F+R+OYr+LP1f5mjaf8e9ePfEH/kar3/cT/wBBNew2f/HvXj3xB/5Gq9/3E/8AQa4s1/3aXqj0Ml/3yPo/zOVooor5s+uCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD82PFH/ACMeq/8AX5N/6Gazq0fFH/Ix6r/1+Tf+hms6v6Xw38GHovyPxzFfxZ+r/M0bP/j3rx74g/8AI1Xv+4n/AKDXsNn/AMe9ePfEH/kar3/cT/0GuLNf92l6o9DJf98j6P8AM5Wiiivmz64KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPzY8Uf8jHqv/X5N/wChms6tHxR/yMeq/wDX5N/6Gazq/pfDfwYei/I/HMV/Fn6v8zRs/wDj3rx74g/8jVe/7if+g17DZ/8AHvXj3xB/5Gq9/wBxP/Qa4s1/3aXqj0Ml/wB8j6P8zlaKKK+bPrgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/NjxR/yMeq/wDX5N/6Gazq0fFH/Ix6r/1+Tf8AoZrOr+l8N/Bh6L8j8cxX8Wfq/wAzRs/+PevHviD/AMjVe/7if+g17DZ/8e9ePfEH/kar3/cT/wBBrgzX/dpeqPQyX/fI+j/M5Wiiivmz64KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPzY8Uf8jHqv/X5N/wChms6tHxR/yMeq/wDX5N/6Gazq/pfDfwYei/I/HMV/Fn6v8zRs/wDj3rx74g/8jVe/7if+g17DZ/8AHvXj3xB/5Gq9/wBxP/Qa4M1/3aXqj0Ml/wB8j6P8zlaKKK+bPrgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/NjxR/yMeq/wDX5N/6Gazq0fFH/Ix6r/1+Tf8AoZrOr+l8N/Bh6L8j8cxX8Wfq/zP/2Q==";

export const ModelIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
    <img 
      src={KAMO_ICON_BASE64}
      alt="Kamocodes AI Assistant"
      className="w-8 h-8 rounded-full object-cover"
    />
  </div>
);

const Message: React.FC<MessageProps> = ({ message, onAddToPage, currentMode }) => {
  const isUser = message.role === MessageRole.USER;
  const isModel = message.role === MessageRole.MODEL;
  
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongMessage = isModel && message.content.length > TRUNCATION_LENGTH;
  const displayContent = isLongMessage && !isExpanded 
    ? message.content.substring(0, TRUNCATION_LENGTH) + '...' 
    : message.content;

  const messageContainerClasses = `flex items-start my-4 animate-fade-in ${
    isUser ? 'justify-end' : 'justify-start gap-3'
  }`;
  
  const messageBubbleClasses = `max-w-md lg:max-w-2xl p-4 rounded-2xl shadow-md transition-colors duration-300 ${
    isUser 
      ? 'bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-200 rounded-br-none' 
      : 'bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-transparent rounded-bl-none'
  }`;

  const canAddToPage = isModel && (message.attachment || (message.content && currentMode === AppMode.ASSISTANT));

  const handleAddToPageClick = () => {
    if (message.attachment) {
      onAddToPage(message.attachment.url, 'image');
    } else if (message.content) {
      onAddToPage(message.content, 'text');
    }
  };

  const messageContent = (
    <div className={messageBubbleClasses}>
      {message.role === MessageRole.MODEL && message.content === '' ? (
        <TypingIndicator />
      ) : (
        <>
          {message.attachment?.url && (
            <div className="mb-2">
              <img
                src={message.attachment.url}
                alt="User attachment"
                className="max-w-xs rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
          {message.content && (
            isModel ? <MarkdownRenderer content={displayContent} /> : <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
          {isLongMessage && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:underline mt-2 focus:outline-none"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            {message.groundingMetadata && message.groundingMetadata.length > 0 ? (
              <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Sources:</h4>
                  <div className="flex flex-col space-y-2">
                      {message.groundingMetadata.map((meta, index) => (
                          <a 
                              key={index} 
                              href={meta.web.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                              {meta.web.title || meta.web.uri}
                          </a>
                      ))}
                  </div>
              </div>
            ) : <div />}

            {canAddToPage && (
              <button 
                onClick={handleAddToPageClick}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline focus:outline-none bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                Add to Page
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={messageContainerClasses}>
      {isUser ? messageContent : (
        <>
          <ModelIcon />
          {messageContent}
        </>
      )}
    </div>
  );
};

export default Message;