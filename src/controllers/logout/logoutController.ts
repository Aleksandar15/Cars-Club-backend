import { RequestHandler } from "express";
import database from "../../database";
import { PayloadObject } from "../../utils/jwtGenerators";
import JWT from "jsonwebtoken";
import getCookieOptions from "../../libs/getCookieOptions";

const logoutController: RequestHandler = async (req, res) => {
  try {
    const cookies = req.cookies;

    // // cookieOptions either this way #1
    // // or #2: call it inside 2nd argument of res.clearCookie()
    // const cookieOptions = getCookieOptions();

    // Check if user misses refreshToken cookie
    if (!cookies?.refreshToken) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Failed to logout - missing refreshToken cookie",
      });
    }

    // Continue if there's refreshToken cookie
    const refreshToken: string = cookies.refreshToken as string;
    // Grab payload no matter its expiration
    const payload: PayloadObject = JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      {
        ignoreExpiration: true,
      }
    ) as PayloadObject;

    // Delete a matching refreshToken from the Database
    const removedRefreshToken = await database.query(
      `DELETE FROM refresh_tokens 
       WHERE user_id=$1 AND refresh_token=$2
       RETURNING refresh_token`,
      [payload.user_id, refreshToken]
    );

    // User has used "logoutAll" feature on some other device
    // and now their refreshToken doesn't exist in Database
    if (removedRefreshToken.rows.length === 0) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Failed to logout - user already logged out",
      });
    }

    // // To log the response headers (set-cookie, etc.)
    // console.log("res.getHeaders:", res.getHeaders());
    // console.log("set-cookie:", res.getHeaders()["set-cookie"])

    // Otherwise send successful logout response
    res.clearCookie("refreshToken", getCookieOptions());
    // 204 code doesn't send my JSON; so use 200 instead.
    // Alternatively 201 'created' - but nothing is created
    // instead 1 'deleted' refresh_token; so go with 200
    return res.status(200).json({
      isSuccessful: true,
      message: "User successfully logged out",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message logoutController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err logoutController:", err);
    }
  }
};
export default logoutController;
