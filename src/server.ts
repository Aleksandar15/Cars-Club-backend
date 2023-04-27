import express, { Application, Request, Response } from "express";

const app: Application = express();

// In case process.env.PORT is undefined use 3000
const PORT: number = Number(process.env.PORT ?? 3000);

app.get("/carsclub", (req: Request, res: Response): void => {
  console.log("/carsclub requested");
  res.send("Welcome to Cars Club!");
});

app.listen(PORT, (): void => {
  console.log(`Connected successfully on PORT:${PORT}`);
});
