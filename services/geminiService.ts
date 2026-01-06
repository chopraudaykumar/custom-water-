import { GoogleGenAI } from "@google/genai";
import { Order, Product } from "../types";

// Note: In a real production app, never expose API keys on the client side.
// This is for demonstration using the requested environment variable pattern.
const apiKey = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const ai = new GoogleGenAI({ apiKey });

export const getSmartSupportResponse = async (
  userMessage: string, 
  products: Product[]
): Promise<string> => {
  try {
    const context = `
      You are "AquaBot", the helpful customer support AI for "Shuddhneer", a premium packaged water delivery brand.
      
      Available Products:
      ${products.map(p => `- ${p.name} (${p.volume}): ₹${p.price}. ${p.description}`).join('\n')}

      Brand Tone: Refreshing, polite, pure, helpful.
      
      Rules:
      1. Keep answers concise (under 50 words unless detail is asked).
      2. If asked about prices, use the provided list.
      3. If asked about delivery, say "We typically deliver within 24 hours."
      4. If asked about "Alkaline", explain its health benefits briefly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `System Context: ${context}` }] },
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });

    return response.text || "I'm having trouble connecting to the hydration network. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm a bit thirsty right now and can't answer. Please try again later.";
  }
};

export const generateCRMInsights = async (orders: Order[]): Promise<string> => {
  try {
    const orderSummary = JSON.stringify(orders.slice(0, 20).map(o => ({
      amount: o.totalAmount,
      status: o.status,
      items: o.items.map(i => i.productName)
    })));

    const prompt = `
      Analyze this JSON sales data for Shuddhneer water brand: ${orderSummary}.
      Provide a 3-bullet point executive summary for the dashboard.
      Focus on revenue trends, popular products, or operational bottlenecks (like pending orders).
      Format as HTML bullet points (<li>).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "<li>Unable to generate insights at this moment.</li>";
  } catch (error) {
    return "<li>Insight generation unavailable.</li>";
  }
};