
import { GoogleGenAI } from "@google/genai";
import { Player } from "../types";

export const generateFitAnalysis = async (player: Player): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Perform a high-level "Alignment Analysis" for this baseball player based on their metrics:
    Name: ${player.name}
    Position: ${player.position}
    Clutch Factor: ${player.clutchFactor}
    Alignment Score: ${player.fitScore}%
    Status: ${player.needsRetest ? 'Needs Retesting' : 'Up to Date'}
    Year: ${player.graduationYear}

    Evaluate how their "Clutch Factor" and the ${player.fitScore}% Alignment Score align for professional or high-level collegiate recruitment. Be concise (2-3 sentences). Highlight if they are a "High Impact" or "Developmental" fit. Explain the reasoning behind the ${player.fitScore}% score provided.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Alignment analysis results are currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The alignment analysis engine is experiencing high demand. Please try again shortly.";
  }
};

export const generateScoutingReport = async (player: Player): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analyze this baseball player's performance data and provide a concise professional scouting report (3-4 sentences):
    Name: ${player.name}
    Position: ${player.position}
    Clutch Factor: ${player.clutchFactor}
    Year of Graduation: ${player.graduationYear || 'Not Specified'}
    
    Focus on what the 'Clutch Factor' might indicate for a player in their position. Be realistic and professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Unable to generate scouting report at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Scouting report service is currently unavailable.";
  }
};
