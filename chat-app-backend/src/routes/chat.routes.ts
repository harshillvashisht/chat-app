import { Router } from "express";
import { getChats , markChatAsRead } from "../controllers/chat.controller";

const router = Router();

router.get("/chat", getChats)
router.post("/chat/:chatId/Read", markChatAsRead)

export default router;

