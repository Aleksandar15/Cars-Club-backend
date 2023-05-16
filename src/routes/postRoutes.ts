import { Router } from "express";
import createPostController from "../controllers/posts/createPostController";
import getImageByIdController from "../controllers/posts/getImageById";
import authorizeJWT from "../middlewares/authorizeJWT";
import multerMiddleware from "../middlewares/multerMiddleware";

const router = Router();

router.post(
  "/createpost",
  authorizeJWT,
  multerMiddleware,
  createPostController
);
// For POSTMAN's lack of sending Authorization's accessToken:
// router.post("/createpost", multerMiddleware, createPostController);

router.get(`/getimagebyid/:id`, getImageByIdController);

export default router;
