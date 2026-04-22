import type { Request, Response, NextFunction } from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.service.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

function parseStock(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await listProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, sku, category, price, status, imageUrl } = req.body;
    const stock = parseStock(req.body.stock);

    if (!name || !sku || !category || !price) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // If file was uploaded via multer, upload to cloudinary
    let uploadedImageUrl = imageUrl || null;
    if (req.file) {
      try {
        uploadedImageUrl = await uploadToCloudinary(req.file.path, "shoply_products");
      } catch (err) {
        res.status(500).json({ message: "Image upload failed" });
        return;
      }
    }

    const result = await createProduct(
      { name, sku, category, price, stock, status: status || "Active", imageUrl: uploadedImageUrl },
      uploadedImageUrl
    );

    res.status(201).json({ message: "Product created", id: result.id });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, sku, category, price, status, imageUrl } = req.body;
    const stock = parseStock(req.body.stock);

    if (!id) {
      res.status(400).json({ message: "ID required" });
      return;
    }

    if (!name || !sku || !category || !price) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    let uploadedImageUrl = imageUrl || null;
    if (req.file) {
      try {
        uploadedImageUrl = await uploadToCloudinary(req.file.path, "shoply_products");
      } catch (err) {
        res.status(500).json({ message: "Image upload failed" });
        return;
      }
    }

    await updateProduct(
      id,
      { name, sku, category, price, stock, status: status || "Active", imageUrl: uploadedImageUrl },
      uploadedImageUrl
    );

    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ message: "ID required" });
      return;
    }

    await deleteProduct(id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
