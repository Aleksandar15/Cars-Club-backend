import { RequestHandler } from "express";
import database from "../../database";

const getSortedPostsController: RequestHandler<{
  limit: string; // Params no longer needed->switched to Query's.
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

    // console.log(
    //   "getSortedPosts req.params:\nreq.params.limit:",
    //   req.params.limit,
    //   "& req.params.offset:",
    //   req.params.offset
    // ); // Stopped using params & instead querys below:

    console.log(
      "getSortedPosts req.query:\nreq.query.limit:",
      req.query.limit,
      "& req.query.offset:",
      req.query.offset,
      "& req.query.carNameTitle:",
      req.query.carNameTitle
    );

    const { limit, offset, carNameTitle } = req.query;
    const limitToNumber = typeof limit === "string" ? parseInt(limit, 10) : 0;
    const offsetToNumber =
      typeof offset === "string" ? parseInt(offset, 10) : 0;
    const carNameTitleString = carNameTitle?.toString();

    // NOTICE
    // I must be converting the incoming string into number
    // as to follow do-not-trust-the-frontend relationship.

    // UPDATE2 very important note is the fact that
    // if User didn't send "carNameTitle" query or params
    // then send the 'TOTAL_POSTS' FROM POSTS
    // otherwise if "carNameTitle" is provided & I do
    // a DIFFERENT .query search against Database, then
    // I must provide a 'TOTAL_POSTS' as the soon-to-be:
    // 'gotSortedPostsROWS.length'
    // & I also wouldn't need to double-query for COUNT(*)
    // in such a case where name is provided.
    // or actually I would but instead of COUNT(*) I will
    // use a different COUNT's value:
    // See more info in my database.sql; but overall:
    // const countQuery = await database.query('SELECT COUNT(*)
    // AS total_count FROM posts WHERE post_title ILIKE $1',
    // [`%${post_title}%`]);
    // -> the ILIKE operator with the % wildcard to perform a
    // case-insensitive search
    // for any 'post_title' containing the provided value.
    // -> so ILIKE operator I will use for `SELECT * FROM
    // posts WHERE post_title ILIKE $1 ORDER BY created_at
    // DESC LIMIT $2 OFFSET $3`.
    // -> must use parseInt(queryName, 10) for LIMIT & OFFSET.

    if (carNameTitleString?.length === 0 || carNameTitleString === undefined) {
      // First task get the length of all Posts without
      // retrieving all the data: COUNT(*) is very fast
      const { rows: totalPostsROWS } = await database.query(
        `
        SELECT COUNT(*) AS total_posts FROM posts
        `
      );
      const total_posts = totalPostsROWS[0].total_posts;
      console.log("total_posts getSortedPosts:", total_posts);

      const { rows: retrievedSortedDataROWS } = await database.query(
        `
        SELECT * FROM posts
        ORDER BY post_created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limitToNumber, offsetToNumber]
      );
      console.log(
        "retrievedSortedDataROWS getSortedPosts:",
        retrievedSortedDataROWS
      );
      // const posts = retrievedSortedDataROWS[0];
      const posts = retrievedSortedDataROWS;
      return res.json({ total_posts, posts }).status(200);
    }

    return res.send("failed to get sorted posts");
  } catch (err) {
    console.log("getSortedPostsController ERR:", err);
  }
};
export default getSortedPostsController;
