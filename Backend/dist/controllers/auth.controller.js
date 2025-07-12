"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// filepath: D:/rewear/Backend/src/controllers/auth.controller.ts
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_model_1.default({
            email,
            password: hashedPassword,
            name,
        });
        yield newUser.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare passwords
        const isPasswordValid = bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.login = login;
