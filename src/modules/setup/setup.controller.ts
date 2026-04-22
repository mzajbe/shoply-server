import type { Request, Response, NextFunction } from "express";
import { setupDatabase } from "./setup.service.js";

export const setup = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await setupDatabase();
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    next(error);
  }
};
