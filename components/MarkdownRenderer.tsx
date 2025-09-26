import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg my-2 relative transition-colors duration-300">
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="font-mono">{code.trim()}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).replace(/^\w*\n/, ''); // Remove backticks and optional language identifier
          return <CodeBlock key={index} code={code} />;
        }
        
        // Basic markdown for bold and italics
        const formattedPart = part
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<em>$1</em>');
        
        return <span key={index} dangerouslySetInnerHTML={{ __html: formattedPart }} />;
      })}
    </div>
  );
};

export default MarkdownRenderer;
