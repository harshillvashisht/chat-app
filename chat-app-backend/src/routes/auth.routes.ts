import { Router } from "express";
import { register, login, getuser, insertPublicKey } from "../controllers/auth.controller";
import { authmiddleware } from "../middleware/auth.middleware";


const router = Router();

router.post("/register", register);
router.post("/login" , login);
router.get("/me", authmiddleware, getuser);
router.patch("/me/publickey", authmiddleware, insertPublicKey);


export default router;