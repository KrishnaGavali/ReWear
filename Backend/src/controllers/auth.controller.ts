import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import authorize from "../middlewares/authorize";

// filepath: D:/rewear/Backend/src/controllers/auth.controller.ts

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

import mongoose from "mongoose";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (await User.exists({ email }))
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashedPassword, name });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("[signup]", error);

    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ message: error.message });

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    console.error("[login]", error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getCurrentUser = [
  authorize,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error: any) {
      console.error("[getCurrentUser]", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
];
