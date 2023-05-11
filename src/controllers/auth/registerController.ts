import bcrypt from "bcrypt";
import database from "../../database";
import { Request, Response } from "express";

const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const findUserByEmail = await database.query(
      "SELECT user_email FROM users WHERE user_email=$1",
      [email]
    );

    // Check if user by e-mail is already registered
    if (findUserByEmail.rows.length) {
      // 409 - Conflict
      return res
        .status(409)
        .json({ isSuccessful: false, message: "User already exists" });
    }

    // Otherwise continue user creation
    // Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const createNewUser = await database.query(
      `INSERT INTO users (user_name, user_email, user_password) 
      VALUES ($1, $2, $3) RETURNING user_name, user_email, user_role`,
      [username, email, hashedPassword]
    );
    return res.status(200).json({
      isSuccessful: true,
      user_info: createNewUser.rows[0],
      message: "User registered successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err.message registerController:", err.message);
      return (
        res
          .status(500)
          // I might want to change the message to be more generic
          // I don't want hackers to know if server went down.
          .json({ isSuccessful: false, message: "Server error" })
      );
    } else {
      console.log("Unexpected err registerController:", err);
    }
  }
};

export default registerController;
