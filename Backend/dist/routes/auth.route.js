"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
// Route for user signup
authRouter.post("/signup", auth_controller_1.signup);
// Route for user login
authRouter.post("/login", auth_controller_1.login);
// Route for me
authRouter.get("/me", auth_controller_1.getCurrentUser);
exports.default = authRouter;
