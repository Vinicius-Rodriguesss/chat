import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import promptTraining from "./prompt";
import "dotenv/config";

const getErrorMessage = (error: unknown) => {
  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status
      ? `Gemini retornou erro ${error.status}: ${error.statusText || error.message}`
      : error.message;
  }

  if (error instanceof Error && error.message.includes("fetch failed")) {
    return "Falha de rede ao acessar o Gemini";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Falha ao comunicar com o Gemini";
};

export async function generateAI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY nao configurada");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: promptTraining,
    });

    const { response } = await model.generateContent(prompt);
    return response.text();
  } catch (error) {
    console.error("Error in generateAI:", error);
    throw new Error(getErrorMessage(error));
  }
}

export default generateAI;
