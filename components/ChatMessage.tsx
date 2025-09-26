
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '../types';
import { SpeakerWaveIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

const SpeakingIndicator: React.FC = () => (
    <div className="flex items-center gap-2 text-gray-500 mb-2">
        <SpeakerWaveIcon className="w-4 h-4 animate-pulse" />
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="p-4 rounded-2xl max-w-[80%] bg-gray-900 text-white shadow-md">
          <div className="prose prose-p:my-0 whitespace-pre-wrap text-inherit text-white">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // Gemini Message Logic
  return (
    <div className="flex flex-col items-start animate-fade-in-up">
      <div className="p-4 rounded-2xl max-w-[80%] bg-white text-gray-800 min-h-[56px] flex flex-col justify-center shadow-md w-full border border-gray-200">
        {message.isAudioPlaying && <SpeakingIndicator />}
        {message.content ? (
          <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:font-semibold prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:underline whitespace-pre-wrap text-inherit">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content.trim()}</ReactMarkdown>
          </div>
        ) : (
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        )}
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Sources</h4>
            <ul className="space-y-1.5">
              {message.sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-blue-600 hover:underline hover:text-blue-800 group"
                  >
                    <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 pt-0.5">{index + 1}.</span>
                    <span className="truncate" title={source.title}>{source.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};