import { Router, Request, Response } from "express";

const router = Router();

router.get("/login", (req: Request, res: Response) => {
  console.log("req.path:", req.path);
  res.json({ status: "test" });
});

export default router;
