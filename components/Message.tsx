

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

const KAMO_ICON_BASE64 = "data:image/png;base64,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";

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