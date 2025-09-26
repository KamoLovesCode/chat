
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { ChatMessage as ChatMessageType } from './types';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { useTranslation } from './hooks/useTranslation';
import { languages } from './translations';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper functions for audio decoding
function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'error' | 'info' }[]>([]);
  const [isGeminiSpeaking, setIsGeminiSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState(() => Date.now());
  
  const { t, language } = useTranslation();

  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const addToast = useCallback((message: string, type: 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const outputAudioContext = outputAudioContextRef.current;
    const outputNode = outputAudioContext.createGain();

    const systemInstruction = `You are a helpful and friendly AI assistant named Kamogelo. Respond in ${languages[language].name}. Keep your responses concise and conversational. For questions about current events, recent information, or topics where up-to-date information is critical, use the search tool to provide the most accurate answers.`;
    
    sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => console.log('Session opened'),
            onmessage: async (message: LiveServerMessage) => {
                const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                if (base64Audio) {
                    setIsGeminiSpeaking(true);
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                    const source = outputAudioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                        if (sourcesRef.current.size === 0) {
                            setIsGeminiSpeaking(false);
                             setMessages(prev => {
                                const lastGeminiMsgIndex = prev.findLastIndex(m => m.sender === 'gemini');
                                if (lastGeminiMsgIndex > -1) {
                                    const newMessages = [...prev];
                                    const msgToUpdate = newMessages[lastGeminiMsgIndex];
                                    if (msgToUpdate.isAudioPlaying) {
                                        newMessages[lastGeminiMsgIndex] = { ...msgToUpdate, isAudioPlaying: false };
                                        return newMessages;
                                    }
                                }
                                return prev;
                            });
                        }
                    });
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                }

                if (message.serverContent?.inputTranscription) {
                    const text = message.serverContent.inputTranscription.text;
                    setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg?.sender === 'user') {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { ...lastMsg, content: lastMsg.content + text };
                            return newMessages;
                        }
                        return [...prev, { id: `${Date.now()}-user`, sender: 'user', content: text }];
                    });
                }
                
                if (message.serverContent?.outputTranscription) {
                    const text = message.serverContent.outputTranscription.text;
                     setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg?.sender === 'gemini') {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { ...lastMsg, content: lastMsg.content + text, isAudioPlaying: true };
                            return newMessages;
                        }
                        return [...prev, { id: `${Date.now()}-gemini`, sender: 'gemini', content: text, isAudioPlaying: true }];
                    });
                }

                if (message.serverContent?.turnComplete) {
                    const metadata = (message.serverContent as any).groundingMetadata;
                    if (metadata?.groundingChunks) {
                        const sources = metadata.groundingChunks
                            .map((chunk: any) => chunk.web)
                            .filter((web: any) => web?.uri && web.title)
                            .map((web: any) => ({ uri: web.uri, title: web.title }));

                        if (sources.length > 0) {
                             setMessages(prev => {
                                const lastMsgIndex = prev.findLastIndex(m => m.sender === 'gemini');
                                if (lastMsgIndex > -1) {
                                    const newMessages = [...prev];
                                    const currentSources = newMessages[lastMsgIndex].sources || [];
                                    const newSources = sources.filter((s: any) => !currentSources.some(cs => cs.uri === s.uri));
                                    if (newSources.length > 0) {
                                       newMessages[lastMsgIndex] = { ...newMessages[lastMsgIndex], sources: [...currentSources, ...newSources] };
                                       return newMessages;
                                    }
                                }
                                return prev;
                            });
                        }
                    }
                }

                if (message.serverContent?.interrupted) {
                    for (const source of sourcesRef.current.values()) {
                        source.stop();
                    }
                    sourcesRef.current.clear();
                    nextStartTimeRef.current = 0;
                    setIsGeminiSpeaking(false);
                }
            },
            onerror: (e: ErrorEvent) => {
                console.error('Session error', e);
                if (e.message && e.message.includes('The service is currently unavailable')) {
                    addToast(t('toast.serviceUnavailable'), 'error');
                } else {
                    addToast(t('toast.geminiError', { errorMessage: e.message }), 'error');
                }
            },
            onclose: () => {
                console.log('Session closed');
            }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            tools: [{googleSearch: {}}],
            systemInstruction
        }
    });

    return () => {
        sessionPromiseRef.current?.then(session => session.close());
        outputAudioContextRef.current?.close();
        outputAudioContextRef.current = null;
    };
  }, [language, addToast, t, sessionId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(Date.now());
  }

  const showWelcome = messages.length === 0;

  const lastMessage = messages[messages.length - 1];
  const userLastMessageContent = (lastMessage?.sender === 'user') ? lastMessage.content : '';

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 text-gray-800">
      <Header onNewChat={handleNewChat} />
      <div className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-2">
          {toasts.map(toast => 
              <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
          )}
      </div>
      
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col pt-16 overflow-hidden">
        
        <main className="flex-1 px-4 overflow-y-auto pt-8 md:pt-12 pb-4">
          {showWelcome ? (
            <WelcomeScreen />
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>
        
        <div className="border-t border-gray-200 bg-white">
            <div className="px-4 flex justify-center">
                 <ChatInput 
                    sessionPromise={sessionPromiseRef.current} 
                    isGeminiSpeaking={isGeminiSpeaking}
                    onMicPermissionError={() => addToast(t('toast.micError'), 'error')}
                    liveInput={userLastMessageContent}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;