import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import promptTraining from "./prompt";
import "dotenv/config";

export async function generateAI(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY nao configurada");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: promptTraining,
    });

    const result = await model.generateContent(prompt);

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in generateAI:", error);

    if (error instanceof GoogleGenerativeAIFetchError) {
      throw new Error(
        error.status
          ? `Gemini retornou erro ${error.status}: ${error.statusText || error.message}`
          : error.message
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("fetch failed")) {
        throw new Error("Falha de rede ao acessar o Gemini");
      }

      throw error;
    }

    throw new Error("Falha ao comunicar com o Gemini");
  }
}

export default generateAI;
