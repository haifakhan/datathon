import { GoogleGenAI } from "@google/genai";
import { FoodBank } from "../types";


const apiKey = import.meta.env.VITE_API_KEY;
// Ideally this is handled via server-side proxy in production, but for hackathon we assume client env or direct key usage (if secure env)
// Note: The prompt prohibits UI for API Key entry, assuming process.env.API_KEY exists.


const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;


export const getDonationSuggestion = async (foodType: string, quantity: string, nearbyBanks: (FoodBank & { distance?: number })[]): Promise<string> => {
 if (!ai) return "AI Service Unavailable: API Key not configured.";


 const bankContext = nearbyBanks.map(b => `${b.name} (${b.distance?.toFixed(1)}km away)`).join(", ");


 const prompt = `
   You are an AI assistant for a food donation platform.
 Your goal is to help restaurants donate surplus food efficiently to nearby food banks or shelters.


 Instructions:
 - Only suggest actions related to food redistribution to real shelters/food banks.
 - Prioritize recommendations based on proximity and capacity of the food banks.
 - Provide practical advice, e.g., packaging, transport, timing.
 - Do NOT invent features, buttons, or UI elements.
 - Keep the response concise (under 50 words).


 Restaurant's available food: ${foodType}
 Quantity: ${quantity}
 Nearby food banks: ${bankContext}


 Provide the best actionable advice for donating this food (keep response under 50 word).
 `;


 try {
   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash',
     contents: prompt,
   });
   return response.text || "No suggestion available.";
 } catch (error) {
   console.error("Gemini API Error:", error);
   return "Unable to generate AI suggestion at this time.";
 }
};


export const getChatResponse = async (userMessage: string): Promise<string> => {
 if (!ai) return "I am offline right now (API Key missing).";


 try {
   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash',
     contents: `You are a helpful assistant for the "ZeroHunger Connect" app.
     Your goal is to help restaurants donate food and helping people find food banks.
     User asks: ${userMessage}
     Answer concisely and helpfully.`,
   });
   return response.text || "I didn't understand that.";
 } catch (error) {
   return "Error connecting to AI.";
 }
};

