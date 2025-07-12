"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("[authorize] Token:", token);
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const decodedPayload = decoded;
        const user = {
            id: decodedPayload.id,
            email: decodedPayload.email,
            role: decodedPayload.role || "user", // Default to 'user' if role is not provided
        };
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid token.", err });
    }
};
exports.default = authorize;
