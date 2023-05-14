import { Request, RequestHandler } from "express";
import JWT from "jsonwebtoken";
import { DecodedObject } from "../utils/jwtGenerators";

// Must use this modified interface so that I can initialize req.user_id below
interface CustomReqProperty extends Request {
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
    if (typeof authHeader === "string") {
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
        }
      );
    }
    next();
  } catch (err) {
    res.status(500).json({ isSuccessful: false, message: "Server error" });
  }
};

export default authorizeJWT;
