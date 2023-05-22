import { RequestHandler } from "express";
import database from "../../database";

const getSortedPostsController: RequestHandler<{
  limit: string;
  offset: string;
}> = async (req, res) => {
  try {
    // console.log("req.params.id:", req.params.id); // Not using for "ALL"
    // const { rows: gotThreePostsROWS } = await database.query(
    //   `
    // SELECT * FROM posts ORDER BY post_created_at DESC LIMIT 3`
    // ); // LIMITing works, however the query was used for testing.
    // console.log("gotThreePostsROWS getSortedPostsController:", gotThreePostsROWS);
    // return res.status(200).json({ gotThreePostsROWS });

    console.log(
      "getSortedPosts req.params:\nreq.params.limit:",
      req.params.limit,
      "& req.params.offset:",
      req.params.offset
    );

    // NOTICE
    // I must be converting the incoming string into number
    // as to follow do-not-trust-the-frontend relationship.

    // First task get the length of all Posts without
    // retrieving all the data: COUNT(*) is very fast
    const total_posts = await database.query(
      `SELECT COUNT(*) AS total_posts FROM posts
    `
    );
    console.log("total_posts getSortedPosts:", total_posts);
    return res.end(total_posts);

    const { rows: gotAllPostsROWS } = await database.query(
      `
    SELECT * FROM posts ORDER BY post_created_at DESC`
    );
    // console.log("gotAllPostsROWS getSortedPostsController:", gotAllPostsROWS);
    return res.status(200).json({ gotAllPostsROWS });
  } catch (err) {
    console.log("getSortedPostsController ERR:", err);
  }
};
export default getSortedPostsController;
