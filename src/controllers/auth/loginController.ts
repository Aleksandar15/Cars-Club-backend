import { Request, Response } from "express";

export const loginController = async (req: Request, res: Response) => {
  try {
    console.log("req.path:", req.path);
    res.json({ status: "test" });
  } catch (err) {
    if (err instanceof Error)
      console.log("err.message loginController:", err.message);
    else {
      console.log("Unexpected error:", err);
    }
  }
};
