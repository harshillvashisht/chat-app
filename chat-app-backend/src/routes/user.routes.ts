import { Router } from "express";
import { userSearch } from "../controllers/user.controller";

const router = Router();

router.get('/search', userSearch);

export default router;