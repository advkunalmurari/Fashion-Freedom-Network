
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  constructor() {}

  async getTalentRecommendations(bio: string, role: string) {
    // Always initialize GoogleGenAI with the API key from process.env.API_KEY directly before making a call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a world-class fashion scout, suggest 3 career focus areas and 5 search tags for a ${role} with the following bio: "${bio}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerFocus: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            searchTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["careerFocus", "searchTags"]
        }
      }
    });
    // Directly access the .text property from GenerateContentResponse
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  }

  async analyzeStyle(imageUrl: string) {
    // Always initialize GoogleGenAI with the API key from process.env.API_KEY directly before making a call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Note: For simplicity, assuming prompt-based analysis. In real usage, send image bytes.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Analyze current high-fashion trends for 2025 and suggest three key aesthetics.",
    });
    // Directly access the .text property from GenerateContentResponse
    return response.text;
  }
}

export const geminiService = new GeminiService();
