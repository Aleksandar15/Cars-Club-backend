import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions";
import cookiePaser from "cookie-parser";
import postRoutes from "./routes/postRoutes";

// Call dotenv.config() once
// to make it available across all files
dotenv.config();
// import "dotenv/config"; // alternatively - works as well

const app: Application = express();

// CORS configurations
app.use(cors(corsOptions as cors.CorsOptions));

// Parse JSON and populate req.body with the parsed data
app.use(express.json());

// Extract cookie data, parse, adds them to req.cookies
app.use(cookiePaser());

// In case process.env.PORT is undefined use 3000
const PORT: number = Number(process.env.PORT ?? 3000);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);

app.listen(PORT, (): void => {
  console.log(`Connected successfully on PORT:${PORT}`);
});
