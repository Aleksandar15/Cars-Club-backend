import { Router } from "express";
import loginController from "../controllers/auth/loginController";
import registerController from "../controllers/auth/registerController";
import refreshtokenController from "../controllers/auth/refreshTokenController";
import validAuthInfo from "../middlewares/validAuthInfo";

const router = Router();

router.post("/login", validAuthInfo, loginController);

router.post("/register", validAuthInfo, registerController);

router.get("/refreshtoken", refreshtokenController);

export default router;
