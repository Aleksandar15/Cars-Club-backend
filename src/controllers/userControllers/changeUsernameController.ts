import { RequestHandler } from "express";

const changeUsernameController: RequestHandler = async (req, res) => {
  try {
    // NOTE THIS LOGIC IS NOT YET IMPLEMENTED
    // Just to add notes:
    // because "Posts" table will be updated to include it as
    // FOREIGN_KEY
    // update like "Change username" must be triggered as well on the
    // "Users" table & "Posts" table.
    // 2.
    // Another logic is make sure to at least select non-changeable ID
    // `SELECT post_created_by_username from posts WHERE user_id=$1` by
    // "user_id" & optionally I can add "AND post_created_by_username=$2"
    // (Thinking about it, 'either or' or 'both' would work.)
    // 3.
    // To update the post in a second query
    // `UPDATE posts SET post_created_by_username=$1 WHERE user_id=$2`
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message changeUsernameController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err changeUsernameController:", err);
    }
  }
};

export default changeUsernameController;
