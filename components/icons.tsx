
import React from 'react';

// For Welcome Screen & Chat Bubbles
export const UserIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-white" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor" 
        className={className}
    >
        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.99 9.99 0 0010 12a9.99 9.99 0 00-6.535 2.493z" />
    </svg>
);

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
);

export const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v3.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5h3.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5H4.5A.5.5 0 004 4.5v2.5A.5.5 0 004.5 7h5a.5.5 0 00.5-.5V4a2 2 0 00-2-2h-2.5z" clipRule="evenodd" />
    </svg>
);

export const SlidersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

export const RefreshIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183" />
    </svg>
);


export const PaperclipIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1118.375 9.09l-10.94 10.94a1.125 1.125 0 11-1.591-1.591l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a.375.375 0 01-.53 0l-2.122-2.122a.375.375 0 010-.53l7.693-7.693a2.625 2.625 0 113.712 3.712L6.375 16.25a.75.75 0 01-1.06-1.06l7.693-7.693z" />
    </svg>
);

export const KeyboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5v3.75h-7.5V7.5zM12 18.75a.375.375 0 110-.75.375.375 0 010 .75zM12 6.75A2.25 2.25 0 0114.25 9v4.5A2.25 2.25 0 0112 15.75h-2.25A2.25 2.25 0 017.5 13.5v-4.5A2.25 2.25 0 019.75 6.75h2.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a.75.75 0 01.75-.75H4.5a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM19.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 15h7.5" />
    </svg>
);

export const StopIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
    </svg>
);

export const BroadcastIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 17.25c.098-1.12 1.026-2.012 2.188-2.176a48.118 48.118 0 0112.124 0c1.162.164 2.09 1.056 2.188 2.176M3.75 13.5c.348-2.923 2.9-5.25 5.812-5.25h1.876c2.913 0 5.465 2.327 5.812 5.25M9.75 10.5a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" />
    </svg>
);

export const ArrowRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 mr-2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

export const GeminiIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#a855f7'}} />
            <stop offset="100%" style={{stopColor: '#ec4899'}} />
          </linearGradient>
        </defs>
        <path d="M12 2.75C11.1716 2.75 10.5 3.42157 10.5 4.25C10.5 5.07843 11.1716 5.75 12 5.75C12.8284 5.75 13.5 5.07843 13.5 4.25C13.5 3.42157 12.8284 2.75 12 2.75Z" fill="url(#gemini-gradient)" />
        <path d="M5.75 7.5C4.92157 7.5 4.25 8.17157 4.25 9C4.25 9.82843 4.92157 10.5 5.75 10.5C6.57843 10.5 7.25 9.82843 7.25 9C7.25 8.17157 6.57843 7.5 5.75 7.5Z" fill="url(#gemini-gradient)" />
        <path d="M12 7.5C10.067 7.5 8.5 9.067 8.5 11V16.5C8.5 18.433 10.067 20 12 20C13.933 20 15.5 18.433 15.5 16.5V11C15.5 9.067 13.933 7.5 12 7.5Z" fill="url(#gemini-gradient)" />
        <path d="M18.25 15C17.4216 15 16.75 15.6716 16.75 16.5C16.75 17.3284 17.4216 18 18.25 18C19.0784 18 19.75 17.3284 19.75 16.5C19.75 15.6716 19.0784 15 18.25 15Z" fill="url(#gemini-gradient)" />
    </svg>
);

export const SmileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4.5 4.5 0 01-6.364 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.358 0 2.662-.354 3.758-.975M12 21c-1.358 0-2.662-.354-3.758-.975m16.474-5.275a9.004 9.004 0 00-15.432 0m15.432 0c.328 .52 .612 1.072.848 1.662M3.75 14.25c.236-.59.52-1.142.848-1.662M12 3c-1.358 0-2.662.354-3.758.975M12 3c1.358 0 2.662.354 3.758.975m-7.517 1.45a9.004 9.004 0 0115.034 0" />
    </svg>
);
