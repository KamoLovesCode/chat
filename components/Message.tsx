import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import TypingIndicator from './TypingIndicator';

interface MessageProps {
  message: ChatMessage;
}

export const ModelIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  </div>
);

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const messageContainerClasses = `flex items-start my-4 animate-fade-in ${
    isUser ? 'justify-end' : 'justify-start gap-3'
  }`;
  
  const messageBubbleClasses = `max-w-md lg:max-w-xl p-4 rounded-2xl shadow-md transition-colors duration-300 ${
    isUser 
      ? 'bg-gray-200 text-black dark:bg-white dark:text-black rounded-br-none' 
      : 'bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-transparent rounded-bl-none'
  }`;

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
          {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
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
