import { RequestHandler } from "express";
import database from "../../database";
import { CustomReqProperty } from "../../middlewares/authorizeJWT";
import { Posts_view_except_post_image } from "../types/getOnePostControllersTypes";

const getOnePostController: RequestHandler = async (
  req: CustomReqProperty,
  res
) => {
  try {
    // console.log(
    //   "req.params.user_id getOnePostController:",
    //   req.params.user_id,
    //   " & req.params.post_id:",
    //   req.params.post_id
    // );
    // console.log("req.user_id getOnePostController:", req.user_id);
    console.log("req.user_role getOnePostController:", req.user_role);

    // Here in the future I can use req.user_role coming from
    // authorizeJWT middleware (JWT Token) to see if User is
    // allowed to remove the Post (if User is 'Admin'/'Super-Admin')
    // This on the frontend is called inside "Edit Post" button
    // however stopping the "lower-ranking"-power User to not even
    // see the ModalPost.tsx will help with the UI/UX to not
    // allow the User to even continue editing
    // Use Case:
    // Ex.: 'moderator' user has a "power" to delete 'user'-role's
    // Posts but doesn't have a power to Edit Post of an 'admin'-role
    // so stop him/her by NOT even allowing him/her to open ModalPost.

    // Note as per database.sql file: "posts_view_except_post_image"
    // is a VIEW that selects ALL COLUMNs except post_image_buffer.

    const { rows: foundOnePostRows } = await database.query(
      `
      SELECT * FROM posts_view_except_post_image 
      WHERE post_id = $1 AND user_id = $2
      `,
      [req.params.post_id, req.params.user_id]
    );
    const foundOnePostRowsTyped =
      foundOnePostRows as Posts_view_except_post_image;
    console.log(
      "foundOnePostRowsTyped getOnePostController:",
      foundOnePostRowsTyped
    );
    if (foundOnePostRowsTyped.length === 0) {
      return res.status(403).json({
        isSuccessful: false,
        message: "Error - user is not authorized to edit post",
      });
    }

    return res.status(200).json({
      isSuccessful: true,
      message: "Post has been found",
      foundOnePostRows, //Don't send Typed version so I can
      // receive it on frontend and attach Types on it the same
      // as in here by "Posts_view_except_post_image"
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message getOnePostController:", err?.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err getOnePostController:", err);
    }
  }
};

export default getOnePostController;
