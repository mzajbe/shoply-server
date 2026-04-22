import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const id = crypto.randomUUID();
    const url = `/uploads/media/${req.file.filename}`;

    res.status(201).json({
      id,
      url,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
};
