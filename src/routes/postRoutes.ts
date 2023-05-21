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
// For POSTMAN's lack of (interceptors) sending Authorization's accessToken:
// router.post("/createpost", multerMiddleware, createPostController); // POSTMAN

// router.get(`/getallposts`, getAllPostsController); // POSTMAN tests
router.get(`/getallposts`, authorizeJWT, getAllPostsController);

// Below was used only for testing images Buffer into SRC value React.
// router.get(`/getimagebyid/:id`, getImageByIdController); // POSTMAN
router.get(`/getimagebyid/:id`, authorizeJWT, getImageByIdController);

export default router;
