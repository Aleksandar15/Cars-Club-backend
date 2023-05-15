import { Router } from "express";
import createPostController from "../controllers/posts/createPostController";
import authorizeJWT from "../middlewares/authorizeJWT";

const router = Router();

router.post("/createpost", authorizeJWT, createPostController);

export default router;
