import { RequestHandler } from "express";
import JWT from "jsonwebtoken";
import { DecodedObject } from "../../utils/jwtGenerators";
import database from "../../database";

const verifyRefreshTokenController: RequestHandler = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken: string = cookies?.refreshToken as string;
    console.log("cookies verifyRefreshTokenController:", cookies);
    // console.log("req.user_email verifyRefreshTokenController:", req.user_email);

    // Check if refreshToken cookie exists
    if (!refreshToken) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Error - refreshToken cookie not found",
      });
    }

    // Verify refreshToken
    JWT.verify(
      refreshToken as string,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err, decoded) => {
        if (err) {
          res.clearCookie("refreshToken");
          return res.status(403).json({
            isSuccessful: false,
            message: "Error - refreshToken has expired",
          });
        }

        const decodedTyped: DecodedObject = decoded as DecodedObject;

        const { rows: userInfo } = await database.query(
          `
        SELECT user_name, user_email FROM users WHERE user_id=$1
        `,
          [decodedTyped?.user_id]
        );
        return res.status(200).json({
          isSuccessful: true,
          message: "User is authenticated",
          user_role: decodedTyped?.user_role,
          user_id: decodedTyped?.user_id,
          user_name: userInfo[0]?.user_name,
          user_email: userInfo[0]?.user_email,
        });
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message verifyRefreshTokenController:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err verifyRefreshTokenController:", err);
    }
  }
};
export default verifyRefreshTokenController;
