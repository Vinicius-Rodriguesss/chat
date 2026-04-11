import express from "express";
import chatController from "./ChatController";

const router = express.Router();

router.post("/chat", chatController);

export default router;
