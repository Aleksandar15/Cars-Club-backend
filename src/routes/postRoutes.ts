import { Router } from "express";
import createPostController from "../controllers/posts/createPostController";
import getAllPostsController from "../controllers/posts/getAllPostsController";
import getImageByIdController from "../controllers/posts/getImageByIdController";
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

router.get(`/getallposts`, getAllPostsController);

export default router;
