import { RequestHandler } from "express";
import multer from "multer";
import database from "../../database";

const createPostController: RequestHandler = async (req, res) => {
  try {
    // return res.status(200).json({ isSuccessful: true, message: "Received" });
    console.log("req.body createPostController11111:", req.body);
    console.count("HANGING");

    console.log("req.file createPostController11111:", req.file);
    console.log(
      "req.file.buffer createPostController11111:",
      req?.file?.buffer
    );
    const { rows: imageRows } = await database.query(
      `INSERT INTO posts (image) VALUES ($1) RETURNING *`,
      [req?.file?.buffer]
    );
    console.log("imageRows:", imageRows);
    res.end("done");
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
