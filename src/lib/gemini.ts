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
      model: 'gemini-3-flash-preview',
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
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Midhun AI, an expert NID (National Institute of Design) mentor. You help students with design thinking, drawing techniques, and exam strategy. Be encouraging, insightful, and concise.",
      tools: [{ googleSearch: {} }], // Enable search grounding for up-to-date info
    }
  });

  // Replay history (simplified for this example, ideally we'd pass the actual history objects)
  // In a real app, we'd map the history to the format expected by the SDK.
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
