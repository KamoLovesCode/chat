
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type Chat, type Part } from '@google/genai';
import { startChat, generateImage } from './services/geminiService';
import { ChatMessage, MessageRole, AppMode, ModelConfig } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const MODELS: ModelConfig[] = [
  {
    id: 'chat',
    name: 'Chat & Write',
    model: 'gemini-2.5-flash',
    mode: AppMode.CHAT,
    systemInstruction: 'You are a helpful and friendly assistant. Your responses should be informative and engaging.',
  },
  {
    id: 'code',
    name: 'Code Assistant',
    model: 'gemini-2.5-flash',
    mode: AppMode.CHAT,
    systemInstruction: 'You are an expert code assistant. Provide clear, concise, and accurate code examples and explanations. Use markdown for code blocks.',
  },
  {
    id: 'image',
    name: 'Creative Images',
    model: 'imagen-4.0-generate-001',
    mode: AppMode.IMAGE,
  },
];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader result is not a string'));
      }
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>(MODELS[0].id);

  const selectedModel = useMemo(() => MODELS.find(m => m.id === selectedModelId)!, [selectedModelId]);

  const resetChat = useCallback(() => {
    setError(null);
    setIsLoading(false);
    
    let welcomeMessage = "Hello! How can I help you today? You can also send me an image.";
    if (selectedModel.id === 'code') {
        welcomeMessage = "I'm your Code Assistant. Ask me anything about programming!";
    } else if (selectedModel.id === 'image') {
        welcomeMessage = "Describe an image you'd like me to create.";
    }
    
    setMessages([{ role: MessageRole.MODEL, content: welcomeMessage }]);

    if (selectedModel.mode === AppMode.CHAT) {
      try {
        setChat(startChat(selectedModel.model, selectedModel.systemInstruction));
      } catch (e: any) {
        setError(e.message);
        console.error(e);
      }
    } else {
      setChat(null);
    }
  }, [selectedModel]);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  const handleSelectModel = (modelId: string) => {
    if (modelId !== selectedModelId) {
      setSelectedModelId(modelId);
    }
  };

  const handleChatMessage = async (message: string, file?: File | null) => {
    if (!chat) return;
    const parts: Part[] = [];
    if (message.trim()) {
      parts.push({ text: message.trim() });
    }
    if (file) {
      const base64Data = await fileToBase64(file);
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    }

    const stream = await chat.sendMessageStream({ message: parts });
    
    let modelResponse = '';
    for await (const chunk of stream) {
      modelResponse += chunk.text;
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === MessageRole.MODEL) {
            lastMessage.content = modelResponse;
        }
        return newMessages;
      });
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    const response = await generateImage(prompt);
    const base64Image = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === MessageRole.MODEL) {
            lastMessage.content = `Here is the image you requested for: "${prompt}"`;
            lastMessage.attachment = {
                url: imageUrl,
                mimeType: 'image/png',
            };
        }
        return newMessages;
    });
  };

  const handleSendMessage = useCallback(async (message: string, file?: File | null) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { role: MessageRole.USER, content: message };
    if (file && selectedModel.mode === AppMode.CHAT) {
      userMessage.attachment = {
        url: URL.createObjectURL(file),
        mimeType: file.type,
      };
    }
    setMessages((prevMessages) => [...prevMessages, userMessage, { role: MessageRole.MODEL, content: '' }]);

    try {
      if (selectedModel.mode === AppMode.CHAT) {
        await handleChatMessage(message, file);
      } else if (selectedModel.mode === AppMode.IMAGE) {
        await handleImageGeneration(message);
      }
    } catch (e: any) {
      const errorMessage = "Sorry, something went wrong. Please try again.";
      setError(errorMessage);
      console.error(e);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length-1];
        if (lastMessage?.role === MessageRole.MODEL) {
            lastMessage.content = errorMessage;
        }
        return newMessages;
      })
    } finally {
      setIsLoading(false);
    }
  }, [chat, selectedModel]);
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-['Montserrat',_sans-serif] transition-colors duration-300">
      <Header />
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">
          <p>{error}</p>
        </div>
      )}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        models={MODELS}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
      />
    </div>
  );
};

export default App;
