import { RequestHandler } from "express";
import database from "../../database";

const getAllPostsController: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    // console.log("req.params.id:", req.params.id); // Not using for "ALL"
    // const { rows: gotThreePostsROWS } = await database.query(
    //   `
    // SELECT * FROM posts ORDER BY post_created_at DESC LIMIT 3`
    // ); // LIMITing works, however the query was used for testing.
    // console.log("gotThreePostsROWS getAllPostsController:", gotThreePostsROWS);
    // return res.status(200).json({ gotThreePostsROWS });

    const { rows: gotAllPostsROWS } = await database.query(
      `
    SELECT * FROM posts ORDER BY post_created_at DESC`
    );
    // console.log("gotAllPostsROWS getAllPostsController:", gotAllPostsROWS);
    return res.status(200).json({ gotAllPostsROWS });
  } catch (err) {
    console.log("getAllPostsController ERR:", err);
  }
};
export default getAllPostsController;
