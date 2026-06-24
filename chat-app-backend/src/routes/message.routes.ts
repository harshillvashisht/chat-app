import { Router } from "express";
import { sendMessage , getMessages} from "../controllers/message.controller";

const router = Router();

router.post("/chat/:chatId", sendMessage);
router.get("/chat/:chatId", getMessages);

export default router;