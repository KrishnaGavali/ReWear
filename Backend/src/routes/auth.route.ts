import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

const authRouter = Router();

// Route for user signup
authRouter.post("/signup", signup);

// Route for user login
authRouter.post("/login", login);

export default authRouter;
