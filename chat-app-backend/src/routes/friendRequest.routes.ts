import { Router } from "express";
import { sendRequest, getRequests, acceptRequest, rejectRequest } from "../controllers/friendRequest.controller";

const router = Router();

router.post("/send", sendRequest );
router.get("/incoming", getRequests);
router.post("/:id/accept", acceptRequest);
router.post("/:id/reject", rejectRequest);

export default router;