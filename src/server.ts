import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import dotenv from "dotenv";

// Call dotenv.config() once to make it available across all files
dotenv.config();
// import "dotenv/config"; // alternatively - works as well

const app: Application = express();

// CORS configurations
app.use(cors());

// Parse JSON and populate req.body with the parsed data
app.use(express.json());

// In case process.env.PORT is undefined use 3000
const PORT: number = Number(process.env.PORT ?? 3000);

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, (): void => {
  console.log(`Connected successfully on PORT:${PORT}`);
});
