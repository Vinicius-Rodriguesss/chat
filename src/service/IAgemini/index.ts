import { GoogleGenerativeAI } from "@google/generative-ai";
import promptTraining from "./prompt";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAI(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: promptTraining,
  });

  const result = await model.generateContent(prompt);

  const response = result.response;
  return response.text();
}

export default generateAI;
