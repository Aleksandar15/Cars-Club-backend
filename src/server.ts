import express, { Application, Request, Response } from "express";

const app = express();

// In case process.env.PORT is undefined use 3000
const PORT: number = Number(process.env.PORT ?? 3000);

app.get("/carsclub", (req: Request, res: Response) => {
  console.log("process.env.PORT Route Handler:", process.env.PORT);
  console.log("called");
  res.send("Welcome to Cars Club!");
});

app.listen(PORT, () => {
  console.log(`Connected successfully on PORT:${PORT}`);
});
