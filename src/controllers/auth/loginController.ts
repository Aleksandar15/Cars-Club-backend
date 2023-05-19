import { Request, Response } from "express";
import database from "../../database";
import bcrypt from "bcrypt";
import JWT, { JwtPayload } from "jsonwebtoken";
import {
  jwtGenerator,
  jwtRefreshGenerator,
  PayloadObject,
} from "../../utils/jwtGenerators";
import getCookieOptions from "../../libs/getCookieOptions";

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password, loginForever } = req.body;
    const expiresIn = loginForever ? "999 years" : "1y";
    const cookies = req.cookies;
    const cookieOptions = getCookieOptions();

    // Find user by email in the Database
    const foundUserByEmail = await database.query(
      `SELECT user_email, user_role, user_password, user_id
       FROM users WHERE user_email = $1`,
      [email]
    );

    // User doesn't exist in the Database
    if (foundUserByEmail.rows.length === 0) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Wrong email/password combinations",
      });
    }

    // If user exists continue
    // Check if user's password matches the hashed password
    const match = await bcrypt.compare(
      password,
      foundUserByEmail.rows[0].user_password
    );
    // If passwords doesn't match
    if (!match) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Wrong email/password combinations",
      });
    }

    // Continue the process if all above "successfully" fails
    const accessToken: string = jwtGenerator(
      foundUserByEmail.rows[0].user_id,
      foundUserByEmail.rows[0].user_role,
      foundUserByEmail.rows[0].user_name,
      "15s"
    );
    const newRefreshToken: string = jwtRefreshGenerator(
      foundUserByEmail.rows[0].user_id,
      foundUserByEmail.rows[0].user_role,
      foundUserByEmail.rows[0].user_name,
      expiresIn
    );

    // DETECT REFRESH TOKEN REUSE ~ START
    // LOGIC:
    // In a case where "refreshToken" exists as a cookie:
    // -> Check if "refreshToken"'s cookie was used or not
    // by querying against the "refresh_tokens" table
    // -> If it was USED: it means it doesn't exist in the
    // "refresh_tokens" table & I'm suspicious
    // that potentially a hacker has used it
    // and -> refreshTokenController.ts had removed it
    // from the Database table 'refresh_tokens' &
    // thus this "refreshToken" cookie would be a giveaway
    // that some suspicious activity happened
    // on behalf of the victimized user.
    // Whereas, it's all good:
    // -> If the legit user has used it: then the
    // refreshTokenController.ts would have already removed
    // the old and used 'refreshToken' from
    // the Database table 'refresh_tokens' & replaced
    // it with a new one that would exist in there, and
    // also had sent a new (UNUSED) 'res.cookie' response.
    if (cookies?.refreshToken) {
      const refreshToken = cookies.refreshToken;
      // Grab payload no matter its expiration
      const payload: PayloadObject = JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        {
          ignoreExpiration: true,
        }
      ) as JwtPayload & PayloadObject;
      // ) as PayloadObject; // Works as well

      if ("user_id" in payload && "user_role" in payload) {
        // NOTE: While I do store user_role in JWT payload, I do not use it
        // as Foreign Key -> I only use the user_id so that's what's needed
        const refreshTokenExistsInDatabase = await database.query(
          `SELECT refresh_token FROM refresh_tokens 
          WHERE user_id=$1 AND refresh_token=$2`,
          [payload.user_id, refreshToken]
        );

        // refreshToken doesn't exists in refresh_tokens table
        // meaning: somebody has used user's refreshToken
        if (refreshTokenExistsInDatabase.rows.length === 0) {
          res.clearCookie("refreshToken", {
            httpOnly: cookieOptions?.httpOnly,
            secure: cookieOptions?.secure,
            sameSite: cookieOptions?.sameSite,
            path: cookieOptions?.path,
            domain: cookieOptions?.domain,
          });
          const hackedUserRemoveAllRTs = await database.query(
            `DELETE FROM refresh_tokens WHERE user_id=$1`,
            [payload.user_id]
          );
          return res.status(403).json({
            isSuccessful: false,
            message: "Detected used refresh token in user's cookies",
          });
        }
      }
    }
    // DETECT REFRESH TOKEN REUSE ~ ENDS

    // All of the above failed "successfully"
    // Handle the authenticated user their authorization tokens
    if ("user_id" in foundUserByEmail.rows[0]) {
      const insertNewRefreshToken = await database.query(
        `INSERT INTO refresh_tokens (user_id, refresh_token) 
         VALUES ($1, $2) RETURNING refresh_token`,
        [foundUserByEmail.rows[0].user_id, newRefreshToken]
      );
    }
    // Also send the refreshToken cookie in the response
    res.cookie("refreshToken", newRefreshToken, {
      maxAge: cookieOptions?.maxAge,
      httpOnly: cookieOptions?.httpOnly,
      secure: cookieOptions?.secure,
      path: cookieOptions?.path,
      domain: cookieOptions?.domain,
      sameSite: cookieOptions?.sameSite,
    });

    // Finally send accessToken to the user's React's Redux Toolkit state
    res.status(200).json({ accessToken });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message loginController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err loginController:", err);
    }
  }
};

export default loginController;
