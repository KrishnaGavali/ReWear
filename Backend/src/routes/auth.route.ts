import { Router } from "express";
import { signup, login, getCurrentUser } from "../controllers/auth.controller";

const authRouter = Router();

// Route for user signup
authRouter.post("/signup", signup);

// Route for user login
authRouter.post("/login", login);

// Route for me
authRouter.get("/me", getCurrentUser);

export default authRouter;
