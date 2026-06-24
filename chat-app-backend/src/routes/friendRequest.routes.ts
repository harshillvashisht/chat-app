import { Router } from "express";
import { sendRequest, getRequests, acceptRequest } from "../controllers/friendRequest.controller";

const router = Router();

router.post("/send", sendRequest );
router.get("/incoming", getRequests);
router.post("/:id/accept", acceptRequest);

export default router;