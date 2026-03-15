import { GoogleGenAI, Type } from '@google/genai';

// Initialize standard Gemini client (uses default injected API key)
export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const generateQuiz = async (topic: string, level: number) => {
  const ai = getGeminiClient();
  const prompt = `Generate a 3-question multiple choice quiz for an NID (National Institute of Design) entrance exam aspirant. 
  Topic focus: ${topic}. Difficulty level: ${level}/10.
  
  IMPORTANT: The questions MUST simulate actual NID DAT Prelims questions. 
  Include:
  1. A critical thinking or problem identification scenario (e.g., "Identify the primary ergonomic flaw in this described product...").
  2. A spatial reasoning or riddle question (e.g., unfolding a cube, pattern completion, or a lateral thinking riddle).
  3. A design awareness or Indian culture question (e.g., traditional crafts, famous Indian designers, sustainable materials).
  
  Return ONLY a valid JSON array of objects with this exact structure:
  [
    {
      "id": "unique_string",
      "type": "riddle" | "spatial" | "problem_identification" | "design_awareness",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // index of correct option (0-3)
      "explanation": "Why this is the correct answer"
    }
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const chatWithMentor = async (message: string, history: any[] = []) => {
  try {
    const ai = getGeminiClient();
    
    // Filter out the initial AI greeting and any error messages
    const validHistory = history.filter((msg, index) => {
      if (index === 0 && msg.role === 'ai') return false;
      if (msg.role === 'ai' && msg.content.includes('Error:')) return false;
      if (msg.role === 'ai' && msg.content.includes('error connecting')) return false;
      return true;
    });

    const contents = validHistory.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: contents,
      config: {
        systemInstruction: "You are Momentum AI, an expert NID (National Institute of Design) mentor. You help students with design thinking, drawing techniques, and exam strategy. Be encouraging, insightful, and concise.",
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in chatWithMentor:", error);
    throw error;
  }
};
