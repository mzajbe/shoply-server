import type { Request, Response, NextFunction } from "express";
import { getThemeConfig, saveThemeConfig } from "./theme.service.js";
import { verifyToken } from "../../utils/jwt.js";

/**
 * Helper to extract and verify token from request (cookies or header)
 */
function getAuthPayload(req: Request): { userId: string; role: string } | null {
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

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = getAuthPayload(req);

    if (!payload) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const config = await getThemeConfig(payload.userId);
    res.status(200).json({ config });
  } catch (error) {
    next(error);
  }
};

export const save = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = getAuthPayload(req);

    if (!payload) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { config } = req.body;

    if (!config) {
      res.status(400).json({ message: "Missing config data" });
      return;
    }

    const result = await saveThemeConfig(payload.userId, config);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
