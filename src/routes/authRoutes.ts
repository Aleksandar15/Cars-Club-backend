import { Router } from "express";
import loginController from "../controllers/auth/loginController";
import registerController from "../controllers/auth/registerController";

import refreshtokenController from "../controllers/auth/refreshTokenController";

const router = Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.get("/refreshtoken", refreshtokenController);

export default router;
