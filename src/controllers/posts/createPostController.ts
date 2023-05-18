import { RequestHandler } from "express";
import database from "../../database";
import { CustomReqProperty } from "../../middlewares/authorizeJWT";

const createPostController: RequestHandler = async (
  req: CustomReqProperty,
  res
) => {
  try {
    // return res.status(200).json({ isSuccessful: true, message: "Received" });
    console.log("req.body createPostController11111:", req.body);
    console.log("req.body.image createPostController11111:", req.body.image);
    console.count("HANGING");

    console.log("req.file createPostController11111:", req.file);
    console.log(
      "req.file.buffer createPostController11111:",
      req?.file?.buffer
    );
    // const { rows: imageRows } = await database.query(
    //   `INSERT INTO posts (image) VALUES ($1) RETURNING *`,
    //   [req?.file?.buffer]
    // );
    // // const { rows: imageRows } = await database.query(
    // //   `INSERT INTO posts (image) VALUES ($1) RETURNING *`,
    // //   [req?.body?.image]
    // // );
    // // console.log("req.body.binaryString:", req.body?.binaryString);
    // // const imageBuffer = Buffer.from(req.body.binaryString, "binary");
    // // const { rows: imageRows } = await database.query(
    // //   `INSERT INTO posts (image) VALUES ($1) RETURNING *`,
    // //   [imageBuffer]
    // // );

    const { title, image, description, contactNumber, askingPrice, currency } =
      req.body;

    const { rows: postsRows } = await database.query(
      `INSERT INTO posts (post_title, post_image, post_description, 
        post_contact_number, post_asking_price, 
        post_asking_price_currency, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        title,
        image,
        description,
        contactNumber,
        askingPrice,
        currency,
        req.user_id, // Comes from authorizeJWT middleware
      ]
    );
    console.log("postsRows createPostController:", postsRows);
    // res.end("done");
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
