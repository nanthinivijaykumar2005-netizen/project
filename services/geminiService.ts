
import { GoogleGenAI } from "@google/genai";
import { LogEntry, Alert } from "../types";

export const analyzeThreats = async (alerts: Alert[], logs: LogEntry[]) => {
  // Initialize with named parameter directly from process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `As a world-class cybersecurity researcher, analyze the following network alerts and logs. 
  Identify patterns, provide a risk assessment, and suggest mitigation steps.
  
  ALERTS:
  ${JSON.stringify(alerts.slice(-5))}
  
  SAMPLED LOGS:
  ${JSON.stringify(logs.slice(-10))}
  
  Format your response as a professional executive summary for a Security Operations Center (SOC).`;

  try {
    // Switched to 'gemini-3-pro-preview' for higher reasoning capability on complex security tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        // Increased thinking budget to support deep reasoning for threat assessment
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });

    // Access .text property directly as it is a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Analysis currently unavailable. Please check system logs.";
  }
};
