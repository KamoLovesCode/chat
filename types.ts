
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
  groundingMetadata?: {
    web: {
      uri: string;
      title: string;
    }
  }[];
  followUpPrompts?: string[];
}

export enum AppMode {
  ASSISTANT = 'assistant',
  WEB_EDITOR = 'web_editor',
  IMAGE = 'image',
}

export interface ModelConfig {
  id: string;
  name: string;
  model: string;
  mode: AppMode;
  systemInstruction?: string;
  availableModels: string[];
}