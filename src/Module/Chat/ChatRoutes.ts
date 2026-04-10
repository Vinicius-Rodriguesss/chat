import express from "express";
import chatController from "./ChatController";

const router = express.Router();

const RoutesChat = () => {
  router.post("/chat", chatController);
  return router;
};

export default RoutesChat;
