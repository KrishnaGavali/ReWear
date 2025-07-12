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
exports.getCurrentUser = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authorize_1 = __importDefault(require("../middlewares/authorize"));
// filepath: D:/rewear/Backend/src/controllers/auth.controller.ts
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const mongoose_1 = __importDefault(require("mongoose"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return res.status(400).json({ message: "All fields are required" });
        if (!isValidEmail(email))
            return res.status(400).json({ message: "Invalid email format" });
        if (yield user_model_1.default.exists({ email }))
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield user_model_1.default.create({ email, password: hashedPassword, name });
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("[signup]", error);
        if (error instanceof mongoose_1.default.Error.ValidationError)
            return res.status(400).json({ message: error.message });
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (!isValidEmail(email))
            return res.status(400).json({ message: "Invalid email format" });
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!(yield bcryptjs_1.default.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("[login]", error);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
exports.login = login;
exports.getCurrentUser = [
    authorize_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const user = yield user_model_1.default.findById(req.user.id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user });
        }
        catch (error) {
            console.error("[getCurrentUser]", error);
            return res
                .status(500)
                .json({ message: "Internal server error", error: error.message });
        }
    }),
];
