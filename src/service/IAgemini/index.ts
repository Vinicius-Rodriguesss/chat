import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import promptTraining from "./prompt";
import "dotenv/config";

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hora
const CACHE_MAX_ENTRIES = 100;

const responseCache = new Map<
  string,
  {
    value: string;
    timestamp: number;
  }
>();

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

const getCacheKey = (prompt: string) => prompt.trim();

const purgeExpiredCacheEntries = () => {
  const now = Date.now();

  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
};

const ensureCacheSizeLimit = () => {
  while (responseCache.size > CACHE_MAX_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (!oldestKey) break;
    responseCache.delete(oldestKey);
  }
};

export async function generateAI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY nao configurada");
  }

  const cacheKey = getCacheKey(prompt);
  if (cacheKey) {
    purgeExpiredCacheEntries();

    const cached = responseCache.get(cacheKey);
    if (cached) {
      return cached.value;
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: promptTraining,
    });

    const { response } = await model.generateContent(prompt);
    const text = response.text();

    if (cacheKey) {
      responseCache.set(cacheKey, {
        value: text,
        timestamp: Date.now(),
      });
      ensureCacheSizeLimit();
    }

    return text;
  } catch (error) {
    console.error("Error in generateAI:", error);
    throw new Error(getErrorMessage(error));
  }
}

export default generateAI;
