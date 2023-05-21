import { RequestHandler } from "express";
import database from "../../database";
import { CustomReqProperty } from "../../middlewares/authorizeJWT";

const editPostController: RequestHandler = async (
  req: CustomReqProperty,
  res
) => {
  try {
    console.log("req.body editPostController:", req.body);
    // console.log("req.user_role editPostController:",
    // req.user_role);
    console.log("req.params editPostController:", req.params);

    // IMPORTANT NOTE1: in order for User to reach this Controller
    // the User must have passed the /getOnePost Controller
    // because that Controller sends ALL the DATA, BUT without the
    // post_image_buffer -> so on the Frontend React's empty field
    // checker Function has been modified to not check against its
    // "" value -> IMPORTANT PART: empty string is possible inside
    // req.body.image -> Also my multerMiddleware logs UNDEFINED
    // for the req.file -> that is OKAY in this editPostController
    // Next,
    // LOGIC behind editPostController:
    // I'll be checking if req.file !== undefined: then inside
    // such a condition my database.QUERY will be different: ALSO
    // UPDATE the post_image_buffer
    // WITH: req.file.buffer -> IMPORTANT: NOT with req.body.image
    // because Multer removes req.body.image PROPERTY and moves it
    // INTO req.file (with its own properties), but
    // -> IF req.file is UNDEFINED, continue, it's OKAY,
    // and ALSO req.body.image will be === '' and that's OKAY too,
    // BUT now I need a new database.QUERY command that
    // will NOT update post_image_buffer.:)
    // console.log("req.body.image:", req.body.image);
    // ^ YES: req.body.image is UNDEFINED (expectedly) IF User has
    // sent an image along for the update -> because my Multer
    // removes req.body.image PROP and CONVERTS it into req.file.
    // However,
    // LOGIC continuation
    // The rest of PROPS should NOT be '' (EXCEPT req.body.image).

    let isEmpty = false;
    for (const property in req.body) {
      if (
        (req.body[property] === undefined ||
          req.body[property] === "" ||
          req.body[property] === null) &&
        property !== "image"
      ) {
        // if they're empty "" or UNDEFINED/NULL, set isEmpty=true;
        isEmpty = true;
        break;
      }
    }

    // // Case: User doesn't wanna update the image, ONLY the fields.
    // if (req.file === undefined && req.body.image === "") {
    //   const {rows: edittedPostROWS} = await database.query(
    //     `
    //     UPDATE posts SET
    //     post_title=$1, post_description=$2,
    //     post_contact_number=$3,
    //     post_asking_price=$4,
    //     post_asking_price_currency=$5
    //     WHERE
    //     `,
    //     [
    //       req.body.title,
    //       req.body.description,
    //       req.body.contactNumber,
    //       req.body.askingPrice,
    //       req.body.currency,
    //     ]
    //   );
    //   console.log('')
    // }
    return res.status(200).json({
      isSuccessful: true,
      message: "Post has been found",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message editPostController:", err?.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err editPostController:", err);
    }
  }
};

export default editPostController;
