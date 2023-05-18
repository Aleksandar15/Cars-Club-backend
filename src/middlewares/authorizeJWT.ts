import { Request, RequestHandler } from "express";
import JWT from "jsonwebtoken";
import { DecodedObject } from "../utils/jwtGenerators";

// Must use this modified interface so that I can initialize req.user_id below
export interface CustomReqProperty extends Request {
  user_id?: string;
  user_role?: string;
}

const authorizeJWT: RequestHandler = async (
  req: CustomReqProperty,
  res,
  next
) => {
  try {
    // Grab authHeader even if header is capitalized
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // authHeader guards - because it can be a String or Array of Strings
    if (typeof authHeader === "string" || authHeader === undefined) {
      // Check if it's correctly formed: starting with 'Bearer '
      if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({
          isSuccessful: false,
          message: "Error authorizing - wrong authorization header format",
        });

      // Grab the token (2nd) part of the authorization's value
      const accessToken = authHeader.split(" ")[1];
      // NOTE: accessToken doesn't exist in a cookie
      // (only refreshToken resides there), but is used by Axios interceptors

      JWT.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
          if (err)
            return res.status(403).json({
              isSuccessful: false,
              message: "Error - accessToken has expired",
            });

          const decodedTyped = decoded as DecodedObject;

          req.user_id = decodedTyped.user_id;
          req.user_role = decodedTyped.user_role;
          next();
        }
      );
    }
    // next(); // BUG1: calls next even on fails responses even
    // // though I have return statements on every response (hm?)
    // // and issue was: postRoute's weren't able to send response
    // // because 'headers already sent' (from authorzieJWT)...
    // // Whatever.., moving it inside JWT.verify's success fixed it.

    // NOTE: I suspected the issue was my axiosInterceptor's setup,
    // but I tested on the frontend using normal axios instance
    // (non-intercepted) and that one was successfully hitting my
    // /api/v1/post/createpost endpoint -> so it seems like this
    // authorizeJWT's next() call's sticks in the intercepted
    // response and hence why my /createpost couldn't receive
    // the req.user_id (was being undefined) & 'headers already set'
    // error occured, which means I might need to look up as to why
    // the normal axios doesn't call this authorizeJWT? But instead
    // bypasses it and goes straight into my /createpost endpoint's
    // logic BUT req.user_id is undefined -> I might have to look
    // it up as to why.

    // NOTE2/UPDATE2: below issue fixed by adding condition of
    // "|| authHeader === undefined" to the Type guards above
    // as much as Typescript can help, it can also make you run into
    // unexpected bugs which you must debug yourself for hours.
    // Anyways bug2 fixed: normal (non-intercepting) axios instances
    // can NO longer bypass authorizeJWT & nor run into authorizeJWT's
    // hanging response bug3 -> which came up by fixing bug1 (moving
    // next() inside JWT's decoded case) -> and bug3 got auto-fixed
    // by fixing bug2:
    // I'm also checking if authHeader===undefined as well.
  } catch (err) {
    res.status(500).json({ isSuccessful: false, message: "Server error" });
  }
};

export default authorizeJWT;
