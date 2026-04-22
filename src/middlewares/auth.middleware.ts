import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware that verifies JWT from cookies or Authorization header.
 * Attaches decoded payload to `req.user`.
 */
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Try cookie first, then Authorization header
    let token: string | undefined;

    // 1. Check cookies
    const cookieToken =
      req.cookies?.token || req.cookies?.["auth-token"];
    if (cookieToken) {
      token = cookieToken;
    }

    // 2. Fall back to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      throw ApiError.unauthorized("No authentication token provided");
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized("Invalid or expired token"));
    }
  }
};
