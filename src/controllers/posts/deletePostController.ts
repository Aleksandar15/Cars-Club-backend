import { RequestHandler } from "express";
import database from "../../database";
import { CustomReqProperty } from "../../middlewares/authorizeJWT";

const deletePostController: RequestHandler = async (
  req: CustomReqProperty,
  res
) => {
  try {
    console.log("req.body deletePostController:", req.body);
    console.log("req.file deletePostController:", req?.file);

    // NOTE I don't need to check if req.params.user_id
    // matches against req.user_id by AuthorizeJWT
    // because AUthorizeJWT would have rejected the
    // Request if middleware couldn't verify the Token.
    // Update: it doesn't really handle it, because
    // I don't .query against Database in AuthorizeJWT.

    // NOTE2 actually such an issue is handled by the
    // fact that there would be 0 Elements in the ROWS
    // Array if 'post is not found' by the given IDS.

    const { rows: deletedPostRows } = await database.query(
      `
      DELETE FROM posts
      WHERE post_id=$1
      AND user_id=$2
      RETURNING *
      `,
      [req.params.post_id, req.params.user_id]
    );

    // Post not found -> 'Already deleted'
    if (deletedPostRows.length === 0) {
      return res.status(400).json({
        isSUccessful: false,
        message: "Post has already been deleted",
      });
    }

    console.log("deletedPostRows deletePostController:", deletedPostRows);

    return res
      .status(200)
      .json({ isSuccessful: true, message: "Post has been deleted" });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message deletePostController:", err?.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err deletePostController:", err);
    }
  }
};

export default deletePostController;
