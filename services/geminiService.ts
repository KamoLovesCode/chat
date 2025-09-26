
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";

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

export async function generateContent(prompt: string, model: string, tools?: any[]): Promise<GenerateContentResponse> {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            tools: tools,
        },
    });
    return response;
}

export async function generateImage(prompt:string, model: string): Promise<GenerateContentResponse> {
  const response = await ai.models.generateImages({
    model: model,
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });
  return response;
}

export async function generateFollowUpPrompts(context: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        systemInstruction: `Based on the preceding conversation, generate 3 brief, relevant follow-up questions the user might have. Return them as a JSON array of strings. Example: ["Tell me more about X", "How does Y work?", "What are some examples of Z?"]. Only return the JSON array and nothing else.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.prompts || [];
  } catch (error) {
    console.error("Error generating follow-up prompts:", error);
    return [];
  }
}