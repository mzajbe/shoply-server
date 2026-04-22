import type { Request, Response, NextFunction } from "express";
import { getStats } from "./stats.service.js";

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
