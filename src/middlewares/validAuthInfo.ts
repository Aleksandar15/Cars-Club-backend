import { Request, Response, NextFunction } from "express";

const validAuthInfo = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  function validEmail(userEmail: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      // 422 - Unprocessable Entity
      return res
        .status(422)
        .json({ isSuccessful: false, message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res
        .status(422)
        .json({ isSuccessful: false, message: "Invalid Email" });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res
        .status(422)
        .json({ isSuccessful: false, message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res
        .status(422)
        .json({ isSuccessful: false, message: "Invalid Email" });
    }
  }

  next();
};

export default validAuthInfo;
