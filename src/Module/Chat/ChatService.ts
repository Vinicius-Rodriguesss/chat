import { generateAI } from "../../service/IAgemini";
const requestChat = (prompt: string) => {
  return generateAI(prompt);
} 

export default requestChat;
