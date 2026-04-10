import type { Request, Response } from "express";
import requestChat from "./ChatService";

const chatController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await requestChat(prompt);

    return res.json({ response });
  } catch (error) {
    console.error("Error in chatController:", error);
    return res.status(500).json({ error: "Erro ao processar chat" });
  }
};

export default chatController;
