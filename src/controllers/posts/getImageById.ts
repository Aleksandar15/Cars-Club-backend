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
    //   `attachment; filename="${"mercedes.jpg"}"`
    // );

    //
    // // return res.status(200).json({ base64Image });
    //
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    return res.status(200).json({ imageSrc });
  } catch (err) {
    console.log("getImageByIdController ERR:", err);
  }
};
export default getImageByIdController;
