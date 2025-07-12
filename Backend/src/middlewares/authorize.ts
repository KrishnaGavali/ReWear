import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "user" | "admin";
      };
    }
  }
}

const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  console.log("[authorize] Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    const decodedPayload = decoded as JwtPayload;

    const user = {
      id: decodedPayload.id as string,
      email: decodedPayload.email as string,
      role: (decodedPayload.role as "user" | "admin") || "user", // Default to 'user' if role is not provided
    };

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token.", err });
  }
};

export default authorize;
