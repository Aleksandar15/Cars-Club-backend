import { RequestHandler } from "express";
import JWT from "jsonwebtoken";
import { DecodedObject } from "../../utils/jwtGenerators";

const verifyRefreshToken: RequestHandler = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken: string = cookies?.refreshToken as string;
    console.log("refreshToken:", refreshToken);

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

        return res.status(200).json({
          isSuccessful: true,
          message: "User is authenticated",
          user_role: decodedTyped?.user_role,
        });
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message verifyRefreshToken:", err.message);
      return res
        .status(500)
        .json({ isSuccessful: false, message: "Server error" });
    } else {
      console.log("Unexpected err verifyRefreshToken:", err);
    }
  }
};
export default verifyRefreshToken;
