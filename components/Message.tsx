
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

const KAMO_ICON_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAE8ATwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX9jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiuR8T+MZdGv2tYbVZSqhmZ3I6jPAAoA66iuD/4WJff8+Fr/wB9P/jR/wALEf8A58If+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXB/8LEk/58Yf+/jf4Uf8LEk/58Yf+/jf4UAd5RXB/wDCxJP+fGH/AL+N/hR/wsST/nxh/wC/jf4UAd5RXn+q/EC6tNRngtbW2ljhYqzOzHI78Z4qj/wsa+/58LX/AL6f/GgDvq4Dx7/yG0/690/rTv+Fj33/AD4Wv/fT/wCNcz4j1yXW79bl40jKxiMKucYHPPPrQBm0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAegeOP+QXa/wDXf/2U153Xonjj/kF2v/Xf/wBlNed0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHoHjj/kF2v8A13/9lNed16J44/5Bdr/13/8AZTXndABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB6B44/5Bdr/ANd//ZTXndd943s7mbTrR4IJZVWY7mjQsByO4rjP7K1E/wDLhd/+A7/4UAQUVMDStRH/AC4Xf/gO/wDhR/ZWof8APhd/+A7/AOFAEFFT/wBlah/z4Xf/AIDv/hR/ZWof8+F3/wCA7/4UAQUVP/ZWof8APhd/+A7/AOFEmn30aF5LO6VR1ZoWAH50AQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFWtPsJ9SvEtbZd8shwB/U+1Vq7P4d2xkvLq5A/1caJn3Yk/wDsgoA0I/AGmqmJri6Z/QRKo/kavWPhXTtGZbuIPI8ZDF5nwB+QA/WtiigBksscEbSyuqIoJZmOAB6k1jyeL9Cicob1WIPVY3I/MCtUjNVZNPtJWLSW0LsepZATQBmf8Jn4f8A+f8AX/v2/+FH/CZ+H/8An/X/AL9v/hV3+w9L/wCfC2/78ij+w9L/AOfC2/78igCn/wAJn4f/AOf9f+/b/wCFL/wmXh/H/H+v/ft/8Kt/2Hpf/Phbf9+RR/Yel/8APhbf9+R2oAp/8Jn4f/5/1/79v/hR/wAJn4f/AOf9f+/b/wCFXf7D0v8A58Lb/vyKP7D0v/nwtv8AvyKAKf8Awmnh/wD5/wBf+/b/AOFH/Ca+H/8An/X/AL9v/hV3+w9L/wCfC2/78ij+w9L/AOfC2/78igCn/wAJp4f/AOf9f+/b/wCFH/Ca+H/+f9f+/b/4Vd/sPS/+fC2/78ij+w9L/wCfC2/78igCn/wmvh//AJ/1/wC/b/4Uf8Jr4f8A+f8AX/v2/wDhV3+w9L/AOfC2/78ij+w9L/AOfC2/78igCn/wAJr4f8A+f8AX/v2/wDhR/wmvh//AJ/1/wC/b/4Vd/sPS/8Anwtv+/Io/sPS/wDnwtv+/IoAp/8ACa+H/wDn/X/v2/8AhR/wmvh//AJ/1/wC/b/4Vd/sPS/8Anwtv+/Io/sPS/wDnwtv+/IoAp/8ACa+H/wDn/X/v2/8AhR/wmvh//AJ/1/wC/b/4Vd/sPS/8Anwtv+/Io/sPS/wDnwtv+/IoAp/8ACa+H/wDn/X/v2/8AhR/wmvh//n/X/v2/+FXf7D0v/nwtv+/Io/sPS/8Anwtv+/IoAp/8Jr4f/wCf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wmvh//n/X/v2/+FH/AAmvh/8A5/1/79v/AIVd/sPS/wDnwtv+/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/ACf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd/sPS/+fC2/wC/Io/sPS/+fC2/78igCn/wAJr4f/AOf9f8Av2/+FH/Ca+H/APn/AF/79v8A4Vd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";

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