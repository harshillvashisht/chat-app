import { Router } from "express";
import { PresignAttachment } from "../controllers/attachments.controller";

const router = Router();

router.post("/presign", PresignAttachment);

export default router;