import OpenAI from "openai";

export const openAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
