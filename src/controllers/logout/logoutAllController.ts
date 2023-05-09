import { RequestHandler } from "express";
import database from "../../database";
import { PayloadObject } from "../../utils/jwtGenerators";
import JWT from "jsonwebtoken";
import getCookieOptions from "../../libs/getCookieOptions";

const logoutAllController: RequestHandler = async (req, res) => {
  try {
    const cookies = req.cookies;

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

    // Delete all refresh_token's from the refresh_tokens
    // Database table by a matching user_id Foreign Key
    const removeAllRefreshTokens = await database.query(
      `DELETE FROM refresh_tokens 
       WHERE user_id=$1 
       RETURNING refresh_token`,
      [payload.user_id]
    );

    // User has used "logoutAll" feature on some other device
    // and now their refreshToken doesn't exist in Database
    if (removeAllRefreshTokens.rows.length === 0) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Failed to logout - user already logged out",
      });
    }

    // Otherwise send successful logout response
    res.clearCookie("refreshToken", getCookieOptions());
    return res.status(200).json({
      isSuccessful: true,
      message: "User successfully logged out from all devices",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message logoutAllController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err logoutAllController:", err);
    }
  }
};
export default logoutAllController;
