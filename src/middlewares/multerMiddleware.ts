import { RequestHandler } from "express";
import multer from "multer";

// NOTE this setup works for only for a single image as
// the upload.single() below code suggests.

const multerMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    console.count("~>>>>>> MULTER MIDDLEWARE");

    console.log("req.file multerMiddleware11111:", req.file);
    upload.single("image")(req, res, async (err) => {
      console.log("req.file multerMiddleware22222:", req.file);
      if (err) {
        return res
          .status(500)
          .json({ isSuccesful: false, message: "Server error" });
      }

      // const file = req.file;

      // NOTE I don't need to manually add req.file because
      // multer does it for me, so unlike authorizeJWT,
      // no need to assign req.file a value.

      console.log("req.file multerMiddleware33333:", req.file);
      // // console.log("req.user_id createPostControler:", req?.user_id);
      // return res.status(200).json({ isSuccessful: true, message: "Received" });
      next();
    });
    // next();
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message multerMiddleware:", err?.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err multerMiddleware:", err);
    }
  }
};

export default multerMiddleware;
