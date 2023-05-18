import { RequestHandler } from "express";
import database from "../../database";

const getAllPostsController: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    console.log("req.params.id:", req.params.id);
    // const gotImageById = await database.query(
    //   `
    // SELECT image FROM posts WHERE id=$1`,
    //   [req.params.id]
    // );
    const { rows: gotThreePostsROWS } = await database.query(
      `
    SELECT * FROM posts ORDER BY post_created_at DESC LIMIT 3`
    );
    console.log(
      "~>~>~>~>~>gotThreePostsROWS getAllPostsController:",
      gotThreePostsROWS
    );
    // const base64Image = Buffer.from(gotImageById?.rows[0].image).toString(
    //   "base64"
    // );
    // headers are NOT needed
    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename="${"mercedes.jpg"}"` // tests hardcoded
    // );

    // // Below works but I'll have to use the imgSrc myself in React.
    // return res.status(200).json({ base64Image });

    // // Instead pass the finished SRC's value
    // const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    // return res.status(200).json({ imageSrc });

    //
    // return res.status(200).json({ imageSrc: gotImageById?.rows[0]?.image });

    //
    // const imageBuffer = gotImageById?.rows[0]?.image;
    // const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    // const imageSrc = URL.createObjectURL(blob);
    // // ERROR ON Frontend:
    // // Not allowed to load local resource: blob:nodedata:9a2a5d27-65c7-4e60-bb20-3640fae3dda1
    // return res.status(200).json({ imageSrc });

    //
    // const imageBuffer = gotImageById?.rows[0]?.image;
    // const base64Image = imageBuffer.toString("base64");
    // return res.status(200).json({ imageSrc: base64Image });
    //

    // return res.status(200).json({ imageSrc: gotImageById?.rows[0].image });
    return res.status(200).json({ gotThreePostsROWS });
  } catch (err) {
    console.log("getAllPostsController ERR:", err);
  }
};
export default getAllPostsController;
