import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

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
    let url = `/uploads/media/${req.file.filename}`;

    try {
      url = await uploadToCloudinary(req.file.path, "shoply_media");
    } catch (err) {
      res.status(500).json({ message: "Image upload failed" });
      return;
    }

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
