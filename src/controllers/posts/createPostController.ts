import { RequestHandler } from "express";

const createPostController: RequestHandler = async (req, res) => {
  try {
    console.log("req.file createPostController:", createPostController);
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
