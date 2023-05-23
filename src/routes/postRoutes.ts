import { Router } from "express";
import createPostController from "../controllers/posts/createPostController";
import getOnePostController from "../controllers/posts/getOnePostController";
import getAllPostsController from "../controllers/posts/getAllPostsController";
import getImageByIdController from "../controllers/posts/getImageByIdController";
import authorizeJWT from "../middlewares/authorizeJWT";
import multerMiddleware from "../middlewares/multerMiddleware";
import editPostController from "../controllers/posts/editPostController";
import deletePostController from "../controllers/posts/deletePostController";
import getSortedPostsController from "../controllers/posts/getSortedPostsController";

const router = Router();

router.post(
  "/createpost",
  authorizeJWT,
  multerMiddleware,
  createPostController
);
// For POSTMAN's lack of (interceptors) sending Authorization's accessToken:
// router.post("/createpost", multerMiddleware, createPostController); // POSTMAN

router.get(`/getonepost/:post_id/:user_id`, authorizeJWT, getOnePostController);

router.put(
  `/editpost/:post_id/:user_id`,
  authorizeJWT,
  multerMiddleware,
  editPostController
);

router.delete(
  `/deletepost/:post_id/:user_id`,
  authorizeJWT,
  deletePostController
);

router.get(
  // `/getsortedposts/:limit/:offset`,
  // // Decided to use query in my Controller, instead.
  `/getsortedposts`,
  authorizeJWT,
  getSortedPostsController
);

// router.get(`/getallposts`, getAllPostsController); // POSTMAN tests
router.get(`/getallposts`, authorizeJWT, getAllPostsController);

// Below was used only for testing images Buffer into SRC value React.
// router.get(`/getimagebyid/:id`, getImageByIdController); // POSTMAN
router.get(`/getimagebyid/:id`, authorizeJWT, getImageByIdController);

export default router;
