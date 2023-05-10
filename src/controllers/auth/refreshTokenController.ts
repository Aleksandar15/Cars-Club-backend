import database from "../../database";
import { Request, Response } from "express";
import JWT, { DecodeOptions, JwtPayload, VerifyErrors } from "jsonwebtoken";
import {
  jwtRefreshGenerator,
  jwtGenerator,
  PayloadObject,
  DecodedObject,
} from "../../utils/jwtGenerators";
import getCookieOptions from "../../libs/getCookieOptions";

const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    const cookieOptions = getCookieOptions();
    console.log("cookies?.refreshToken:", cookies?.refreshToken);

    // If refreshToken doesn't exist immediately respond
    if (!cookies?.refreshToken) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Error - user is missing cookies",
      });
    }

    // Otherwise continue the process
    // Delete "refreshToken" cookie
    res.clearCookie("refreshToken", getCookieOptions());
    // Grab refreshToken
    const refreshToken: string = cookies.refreshToken as string;
    // Grab payload no matter its expiration
    const payload: PayloadObject = JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      {
        ignoreExpiration: true,
      }
    ) as PayloadObject;

    const refreshTokenFoundInDatabase = await database.query(
      `SELECT refresh_token FROM refresh_tokens
       WHERE user_id=$1 AND refresh_token=$2`,
      [payload.user_id, refreshToken]
    );

    // If refresh_token is not found in the database
    // has anyone used the token on behalf of the user (a hacker)?
    // Or is it just someone else logged in the same account on
    // different device clicking "logoutallsessions" in meantime?
    // Make sure to warn the user for both cases & log them:
    if (refreshTokenFoundInDatabase.rows.length === 0) {
      // REUSE Detection attempt (by a hacker?):

      // then remove all of their refresh_token's from Database
      const deleteAllRTsFromDatabase = await database.query(
        `
      DELETE FROM refresh_tokens WHERE user_id=$1
        `,
        [payload.user_id]
      );

      return res.status(403).json({
        isSuccessful: false,
        message: "Error - detected refresh token reuse attempt",
      });
    }
    // Not found refresh_token CASE ENDS.

    // Continue the process
    // Goal: deliver new refreshToken + accessToken
    // & invalidate the received valid refreshToken

    // Evaluate that same refreshToken coming from Request object:
    JWT.verify(
      refreshToken as string,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: VerifyErrors | null, decoded) => {
        if (err) {
          // if expired
          // Even if expired -> still remove it from the Database
          const removeReceivedRTfromDatabase = await database.query(
            `
            DELETE FROM refresh_tokens 
            WHERE user_id=$1 
            AND refresh_token=$2
            `,
            [payload.user_id, refreshToken]
          );
          return res.status(401).json({
            isSuccessful: false,
            message: "Error - token expired",
          });
        }

        // If refreshToken is valid continue the same spiel:
        // Generate new accessToken with ultra short expiresIn time.
        // Goal is accessToken to be used only in a single 1 request
        const accessToken = jwtGenerator(
          (decoded as DecodedObject).user_id,
          (decoded as DecodedObject).user_role,
          "15s"
        );

        // Grab the remaining time of the "valid" (non-expired) refresh token 'refreshToken'
        // that is about to be "invalidated" (removed from the Database) because
        // it was used to create (new) 'accessToken' for response to the frontend's interceptors.
        // And exchange it with new refresh token 'newRefreshToken' && Add it to Database
        const newRTexpiryTimeSeconds =
          // Date.parse() TSC Error:
          // "Argument of type 'Date' is not assignable to parameter of type 'string'"
          // (decoded as DecodedObject).exp - Date.parse(new Date()) / 1000;
          // Fix/Alternative:
          (decoded as DecodedObject).exp - Math.floor(Date.now() / 1000);

        const newRefreshToken: string = jwtRefreshGenerator(
          (decoded as DecodedObject).user_id,
          (decoded as DecodedObject).user_role,
          newRTexpiryTimeSeconds
        );

        // "Invalidate" old ("used") refreshToken
        // by REPLACING old & "used" refreshToken
        // with new "unused" newRefreshToken
        const newRTreplacedInDatabase = await database.query(
          `
          UPDATE refresh_tokens SET refresh_token=$1
          WHERE user_id=$2 AND refresh_token=$3
          RETURNING user_id, refresh_token
          `,
          // NOTE
          // SET newRefreshToken
          // WHERE clause: 'old & used refreshToken'
          [newRefreshToken, (decoded as DecodedObject).user_id, refreshToken]
        );

        // res.cookie("refreshToken", newRefreshToken, getCookieOptions());
        // (TSC Error: "No overload matches this call.")
        // Fix:
        res.cookie("refreshToken", newRefreshToken, {
          maxAge: cookieOptions?.maxAge,
          httpOnly: cookieOptions?.httpOnly,
          secure: cookieOptions?.secure,
          sameSite: cookieOptions?.sameSite,
          path: cookieOptions?.path,
          domain: cookieOptions?.domain,
        });

        return res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message in refreshTokenController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected error refreshToken:", (err as Error).message);
    }
  }
};

export default refreshTokenController;
