import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MicrophoneIcon, StopIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';
import { LiveSession, Blob } from '@google/genai';

interface ChatInputProps {
    sessionPromise: Promise<LiveSession> | null;
    isGeminiSpeaking: boolean;
    onMicPermissionError: () => void;
    liveInput: string;
}

function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


const Waveform: React.FC = () => (
    <div className="flex items-center justify-center space-x-0.5 h-full w-48">
        {[...Array(24)].map((_, i) => (
            <div
                key={i}
                className="w-1 bg-gray-400 rounded-full animate-wave"
                style={{
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: `1s`
                }}
            ></div>
        ))}
    </div>
);

export const ChatInput: React.FC<ChatInputProps> = ({ sessionPromise, isGeminiSpeaking, onMicPermissionError, liveInput }) => {
    const [isRecording, setIsRecording] = useState(false);
    const { t } = useTranslation();

    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const silenceTimerRef = useRef<number | null>(null);

    const stopStreaming = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setIsRecording(false);
    }, []);
    
    const startStreaming = useCallback(async () => {
        if (isRecording || !sessionPromise) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });
            streamRef.current = stream;
            
            const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = context;
            
            const source = context.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = context.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            const SILENCE_THRESHOLD = 0.01;
            const SILENCE_DURATION_MS = 1500;

            processor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                
                // Voice Activity Detection (VAD)
                const rms = Math.sqrt(inputData.reduce((sum, val) => sum + val * val, 0) / inputData.length);

                if (rms < SILENCE_THRESHOLD) {
                    if (!silenceTimerRef.current) {
                        silenceTimerRef.current = window.setTimeout(() => {
                            stopStreaming();
                        }, SILENCE_DURATION_MS);
                    }
                } else if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }

                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };

            source.connect(processor);
            processor.connect(context.destination);
            
            setIsRecording(true);
        } catch (err) {
            console.error('Error getting media stream:', err);
            if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                onMicPermissionError();
            }
            stopStreaming();
        }
    }, [isRecording, sessionPromise, onMicPermissionError, stopStreaming]);


    const handleMicClick = () => {
        if (isGeminiSpeaking) return;

        if (isRecording) {
            stopStreaming();
        } else {
            startStreaming();
        }
    };

    useEffect(() => {
        return () => {
            stopStreaming();
        };
    }, [stopStreaming]);

    return (
        <div className="flex flex-col items-center gap-3 py-4 w-full">
            <div className="min-h-[3.5rem] flex items-center justify-center text-center px-4 w-full">
                {isRecording ? (
                    liveInput ? (
                        <p className="text-gray-700 text-lg leading-tight">{liveInput}</p>
                    ) : (
                        <Waveform />
                    )
                ) : (
                    <p className="text-gray-500 text-base">
                        {isGeminiSpeaking ? t('chatInput.status.thinking') : t('chatInput.status.talk')}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-center">
                <button
                    onClick={handleMicClick}
                    disabled={isGeminiSpeaking}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl
            ${isRecording ? 'bg-red-600 animate-pulse-ring' : 'bg-gray-900 animate-glow'}
            disabled:bg-gray-500 disabled:animate-none disabled:cursor-not-allowed`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                    {isRecording ? <StopIcon /> : <MicrophoneIcon className="w-8 h-8" />}
                </button>
            </div>
        </div>
    );
};