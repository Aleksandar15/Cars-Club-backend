import { RequestHandler } from "express";
import database from "../../database";

const getImageByIdController: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    console.log("req.params.id:", req.params.id);
    const gotImageById = await database.query(
      `
    SELECT image FROM posts WHERE id=$1`,
      [req.params.id]
    );
    console.log("gotImageById.rows[0]", gotImageById?.rows[0].image);
    const base64Image = Buffer.from(gotImageById?.rows[0].image).toString(
      "base64"
    );
    // headers are NOT needed
    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename="${"mercedes.jpg"}"` // tests hardcoded
    // );

    // // Below works but I'll have to use the imgSrc myself in React.
    // return res.status(200).json({ base64Image });

    // Instead pass the finished SRC's value
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    return res.status(200).json({ imageSrc });
  } catch (err) {
    console.log("getImageByIdController ERR:", err);
  }
};
export default getImageByIdController;
