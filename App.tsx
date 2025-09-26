
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type Chat } from '@google/genai';
import { startChat, generateImage, generateContent, generateFollowUpPrompts } from './services/geminiService';
import { ChatMessage, MessageRole, AppMode, ModelConfig } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const MODELS: ModelConfig[] = [
  {
    id: 'assistant',
    name: 'Assistant',
    model: 'gemini-2.5-flash',
    mode: AppMode.ASSISTANT,
    systemInstruction: 'You are a helpful and friendly assistant. Answer questions using the provided search results.',
    availableModels: ['gemini-2.5-flash'],
  },
  {
    id: 'web-editor',
    name: 'Web Page Editor',
    model: 'gemini-2.5-flash',
    mode: AppMode.WEB_EDITOR,
    systemInstruction: 'You are an expert web developer. The user will provide HTML code and instructions for changes. You must return only the complete, updated HTML code within a single markdown code block (` ```html ... ``` `) and nothing else.',
    availableModels: ['gemini-2.5-flash'],
  },
  {
    id: 'image',
    name: 'Creative Images',
    model: 'imagen-4.0-generate-001',
    mode: AppMode.IMAGE,
    availableModels: ['imagen-4.0-generate-001'],
  },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<string>(MODELS[0].id);
  const [code, setCode] = useState<string>('');
  
  const selectedModeConfig = useMemo(() => MODELS.find(m => m.id === selectedModeId)!, [selectedModeId]);
  const [selectedModelName, setSelectedModelName] = useState<string>(selectedModeConfig.model);


  const resetChat = useCallback(() => {
    setError(null);
    setIsLoading(false);
    
    if (selectedModeConfig.id !== 'web-editor') {
        setCode('');
    }
    
    let welcomeMessage = "Hello! Ask me anything, and I'll use Google Search to find the latest information for you.";
    if (selectedModeConfig.id === 'web-editor') {
        welcomeMessage = "Welcome to the Web Page Editor. Import an HTML file or generate content to add here.";
    } else if (selectedModeConfig.id === 'image') {
        welcomeMessage = "Describe an image you'd like me to create.";
    }
    
    setMessages([{ role: MessageRole.MODEL, content: welcomeMessage }]);

    if (selectedModeConfig.mode === AppMode.WEB_EDITOR) {
      try {
        setChat(startChat(selectedModelName, selectedModeConfig.systemInstruction));
      } catch (e: any) {
        setError(e.message);
        console.error(e);
      }
    } else {
      setChat(null);
    }
  }, [selectedModeConfig, selectedModelName]);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  useEffect(() => {
    // When mode changes, update the selected model to the first available one for that mode
    setSelectedModelName(selectedModeConfig.availableModels[0]);
  }, [selectedModeConfig]);

  const handleSelectMode = (modeId: string) => {
    if (modeId !== selectedModeId) {
      setSelectedModeId(modeId);
    }
  };

  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCode(text);
      setMessages(prev => [...prev, { role: MessageRole.MODEL, content: `Successfully imported \`${file.name}\`. Now, tell me how you'd like to change it.`}])
    };
    reader.onerror = (e) => {
      setError(`Error reading file: ${e.target?.error?.message}`);
    }
    reader.readAsText(file);
  };

  const handleAddToPage = (content: string, type: 'text' | 'image') => {
    let newElement = '';
    if (type === 'image') {
      newElement = `\n    <img src="${content}" alt="AI generated image" style="max-width: 100%; height: auto; border-radius: 8px; margin-block: 1em;" />\n`;
    } else {
      newElement = `\n    <p>${content}</p>\n`;
    }

    let newCode = code;
    if (!newCode.trim()) {
        newCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto; color: #333; }
        img { max-width: 100%; height: auto; border-radius: 8px; }
    </style>
</head>
<body>
</body>
</html>`;
    }
    
    const bodyEndTagIndex = newCode.lastIndexOf('</body>');
    if (bodyEndTagIndex !== -1) {
        newCode = newCode.slice(0, bodyEndTagIndex) + newElement + newCode.slice(bodyEndTagIndex);
    } else {
        newCode += newElement;
    }

    setCode(newCode);
    setSelectedModeId('web-editor');
    setMessages(prev => [...prev, { role: MessageRole.MODEL, content: `Content added to the Web Page Editor. You can now see it in the code and ask for more changes.`}]);
  };

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === MessageRole.MODEL) {
            delete lastMessage.followUpPrompts;
        }
        return newMessages;
    });

    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { role: MessageRole.USER, content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage, { role: MessageRole.MODEL, content: '' }]);

    try {
      if (selectedModeConfig.mode === AppMode.ASSISTANT) {
        const response = await generateContent(message, selectedModelName, [{googleSearch: {}}]);
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk) ?? [];
        
        const conversationContext = `User: ${message}\nAssistant: ${response.text}`;
        const prompts = await generateFollowUpPrompts(conversationContext);

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length-1];
          if (lastMessage?.role === MessageRole.MODEL) {
              lastMessage.content = response.text;
              lastMessage.groundingMetadata = groundingMetadata;
              lastMessage.followUpPrompts = prompts;
          }
          return newMessages;
        });

      } else if (selectedModeConfig.mode === AppMode.WEB_EDITOR) {
        if (!chat) throw new Error("Chat not initialized for web editor.");
        if (!code) {
            throw new Error("Please import an HTML file first.");
        }
        
        const fullPrompt = `${message}\n\nHere is the current HTML code:\n\`\`\`html\n${code}\n\`\`\``;
        const stream = await chat.sendMessageStream({ message: fullPrompt });
        
        let modelResponse = '';
        for await (const chunk of stream) {
          modelResponse += chunk.text;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === MessageRole.MODEL) {
                lastMessage.content = "Generating new code...";
            }
            return newMessages;
          });
        }

        const codeBlockRegex = /```html\n([\s\S]*?)```/;
        const match = modelResponse.match(codeBlockRegex);
        if (match && match[1]) {
          const newCode = match[1].trim();
          setCode(newCode);
           setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === MessageRole.MODEL) {
                lastMessage.content = "I've updated the code in the editor based on your instructions.";
            }
            return newMessages;
          });
        } else {
            throw new Error("The model did not return valid HTML code. Please try again.");
        }

      } else if (selectedModeConfig.mode === AppMode.IMAGE) {
        const response = await generateImage(message, selectedModelName);
        const base64Image = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === MessageRole.MODEL) {
                lastMessage.content = `Here is the image you requested for: "${message}"`;
                lastMessage.attachment = {
                    url: imageUrl,
                    mimeType: 'image/png',
                };
            }
            return newMessages;
        });
      }
    } catch (e: any) {
      const errorMessage = e.message || "Sorry, something went wrong. Please try again.";
      setError(errorMessage);
      console.error(e);
      setMessages(prev => {
        const newMessages = [...prev.slice(0, -1)]; // Remove the empty model message
        return [...newMessages, { role: MessageRole.MODEL, content: errorMessage }];
      })
    } finally {
      setIsLoading(false);
    }
  }, [chat, selectedModeConfig, code, selectedModelName]);
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header />
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">
          <p>{error}</p>
        </div>
      )}
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onPromptClick={handleSendMessage}
        onAddToPage={handleAddToPage}
        currentMode={selectedModeConfig.mode}
      />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        models={MODELS}
        selectedModeConfig={selectedModeConfig}
        onSelectMode={handleSelectMode}
        selectedModelName={selectedModelName}
        onSelectModelName={setSelectedModelName}
        code={code}
        onCodeChange={setCode}
        onFileImport={handleFileImport}
      />
    </div>
  );
};

export default App;