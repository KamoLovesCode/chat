
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export function startChat(modelName: string, systemInstruction?: string): Chat {
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction,
    },
  });
}

export async function generateImage(prompt: string): Promise<GenerateContentResponse> {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });
  return response;
}
