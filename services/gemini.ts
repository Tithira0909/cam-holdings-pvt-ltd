import { GoogleGenAI } from "@google/genai";

export const getAIRecommendation = async (userQuery: string) => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: `You are the Premium Concierge for CAM Holdings (PVT) LTD, a luxury real estate and property development firm in Sri Lanka. 
        Provide expert, professional, and sophisticated advice about property investment, architectural trends (tropical modernism, sustainable building), 
        and the building process in Sri Lanka (Plan, Design, Build, Finish). 
        Always sound high-end, helpful, and encourage the user to 'Request a Proposal' for tailored services.
        Keep responses concise and elegant.`,
      },
    });
    // Accessing .text as a property as per SDK documentation
    return response.text || "I apologize, I am unable to assist at this moment. Please connect with our consultants directly.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our concierge is currently unavailable. Please contact us via the Proposal form.";
  }
};

export const generateVideo = async (prompt: string, imageBase64: string, aspectRatio: '16:9' | '9:16') => {
  // Create a new GoogleGenAI instance right before the call to ensure latest API key
  const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await genAI.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'A cinematic architectural walkthrough of this building site with modern lighting',
    image: {
      imageBytes: imageBase64,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  // Recommended polling interval for video generation
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await genAI.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a URI.");
  
  // Return download link with API key attached
  return `${downloadLink}&key=${process.env.API_KEY}`;
};