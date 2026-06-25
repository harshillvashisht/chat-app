import { Router } from "express";
import { getChats } from "../controllers/chat.controller";

const router = Router();

router.get("/chat", getChats)

export default router;