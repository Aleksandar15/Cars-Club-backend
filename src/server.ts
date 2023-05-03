import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";

const app: Application = express();

// In case process.env.PORT is undefined use 3000
const PORT: number = Number(process.env.PORT ?? 3000);

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, (): void => {
  console.log(`Connected successfully on PORT:${PORT}`);
});
