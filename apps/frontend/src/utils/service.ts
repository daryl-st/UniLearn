// This whole page is just here for now for testing purpose.
// import { GoogleGenAI } from "@google/genai";

const API_KEY = (import.meta as any).env?.GEMINI_API_KEY;

let genAI: any = null;

if (API_KEY) {
  // genAI = new GoogleGenAI({ apiKey: API_KEY }) as any;
}

export async function getChatResponse(message: string, context: string) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are UniLearn AI Copilot v4.2, a high-precision enterprise learning assistant.
    Context: ${context}
    User Message: ${message}
    
    Provide a concise, technical, and professional response. 
    Use markdown for formatting.
    If the user asks for code, provide high-quality snippets.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
