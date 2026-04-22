import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import fs from "fs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string, folder: string = "shoply") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });
    // Delete file after upload
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    // Delete file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};
