import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getUserById } from "./auth.service.js";
import { env } from "../../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await registerUser({ email, password, name, phone, role });

    // Set HTTP-only cookie (matching Next.js behavior)
    res.cookie("token", result.token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser({ email, password });

    // Set HTTP-only cookie (matching Next.js behavior)
    res.cookie("token", result.token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies or auth header
    let token: string | undefined;
    const cookieToken = req.cookies?.token || req.cookies?.["auth-token"];
    if (cookieToken) {
      token = cookieToken;
    }
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      res.status(200).json({ user: null });
      return;
    }

    // Verify token manually (don't use middleware to return null instead of error)
    let payload: { userId: string; role: string };
    try {
      const { verifyToken } = await import("../../utils/jwt.js");
      payload = verifyToken(token);
    } catch {
      res.status(200).json({ user: null });
      return;
    }

    const user = await getUserById(payload.userId);
    res.status(200).json({ user: user || null });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
