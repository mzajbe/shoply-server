import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), "public", "uploads");
const mediaDir = path.join(uploadDir, "media");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Storage for product images
const productStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  },
});

// Storage for media uploads
const mediaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mediaDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  },
});

// File filter: only allow images
const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are supported"));
  }
};

export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadMediaFile = multer({
  storage: mediaStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
