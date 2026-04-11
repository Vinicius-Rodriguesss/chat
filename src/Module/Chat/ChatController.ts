import type { Request, Response } from "express";
import { generateAI } from "../../service/IAgemini";

const chatController = async (req: Request, res: Response) => {
  try {
    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt invalido" });
    }

    const response = await generateAI(prompt);

    return res.json({ response });
  } catch (error) {
    console.error("Error in chatController:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao processar chat";

    return res.status(502).json({
      error: message,
    });
  }
};

export default chatController;
