import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";

const router = Router();

router.get("/login", loginController);

export default router;
