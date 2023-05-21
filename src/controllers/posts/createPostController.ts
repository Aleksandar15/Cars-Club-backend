import { RequestHandler } from "express";
import database from "../../database";
import { CustomReqProperty } from "../../middlewares/authorizeJWT";

const createPostController: RequestHandler = async (
  req: CustomReqProperty,
  res
) => {
  try {
    console.log("req.body createPostController:", req.body);
    console.log("req.file createPostController:", req?.file);

    const {
      title,
      description,
      contactNumber,
      askingPrice,
      currency,
      user_name,
      user_email,
    } = req.body;

    // Fixing issue or rather IMPROVING the
    // "Don't trust the frontend"-relationships, where this error:
    // "err.message createPostController: value too long
    // for type character varying(5)" -> occured on Currency (bug)
    // being UNDEFINED -> and was confusing BUT true in same time
    // (UNDEFINED has length higher than 5).

    let isEmpty = false;
    for (const property in req.body) {
      if (
        // req.body.hasOwnProperty(property) &&
        // // ^ that must be TRUE AND (&&)
        // // UPDATE: .hasOwnProperty "is not a function" in Node
        // instead ONLY:
        req.body[property] === undefined ||
        req.body[property] === "" ||
        req.body[property] === null
      ) {
        // if they're empty "" or UNDEFINED/NULL, set isEmpty=true;
        isEmpty = true;
        break;
      }
    }
    // // Alternative one-liner
    // const isEmpty = Object.values(req.body).some(
    //   (value) => value === "" || value === undefined
    // );

    if (isEmpty) {
      res.status(400).json({
        isSuccessful: false,
        message:
          "Error - properties can not be empty string or null or undefined.",
      });
    }

    const { rows: postsRows } = await database.query(
      `INSERT INTO posts (post_title, post_image_buffer, 
        post_description, post_contact_number, 
        post_asking_price, post_asking_price_currency, 
        user_id,
        post_created_by_user_name,
        post_created_by_user_email,
        post_created_by_user_role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        title,
        req.file?.buffer, //Multer.File object populated by single() middleware.
        description,
        contactNumber,
        askingPrice,
        currency,
        req.user_id, // Comes from authorizeJWT middleware
        user_name,
        user_email,
        req.user_role, // also from JWT TOKEN
      ]
    );
    // console.log("postsRows createPostController:", postsRows);
    // (postsRows .QUERY returns nothing)
    return res
      .status(200)
      .json({ isSuccessful: true, message: "Post has been created" });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message createPostController:", err?.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err createPostController:", err);
    }
  }
};

export default createPostController;
