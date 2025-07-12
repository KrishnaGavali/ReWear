import express, { Request, Response } from "express";
import connectToDatabase from "./db";
import authRouter from "./routes/auth.route";

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

connectToDatabase().then(() => {
  console.log("Database connection established");
});

app.use("/auth", authRouter);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! Backend is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} and port ${port}`);
});
