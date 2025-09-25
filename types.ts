
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  attachment?: {
    url: string;
    mimeType: string;
  };
}

export enum AppMode {
  CHAT = 'chat',
  IMAGE = 'image',
}

export interface ModelConfig {
  id: string;
  name: string;
  model: string;
  mode: AppMode;
  systemInstruction?: string;
}
