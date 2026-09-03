import { Router } from "express";
import { getChats , markChatAsRead, getChatPublicKey } from "../controllers/chat.controller";

const router = Router();

router.get("/chat", getChats)
router.post("/chat/:chatId/Read", markChatAsRead)
router.get("/chat/:chatId/public-key", getChatPublicKey) // This route is for fetching the public key of a chat for encryption purposes

export default router;

