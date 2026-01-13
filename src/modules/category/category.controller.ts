import type { Request, Response, NextFunction } from "express";
import {
  createCategory,
  listCategories,
  listCategoriesByStore,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { storeId, name, description, image, slug, sortOrder } =
      req.body;

    if (!storeId || !name) {
      throw new Error("storeId and name are required");
    }

    const category = await createCategory({
      storeId,
      name,
      description,
      image,
      slug,
      sortOrder,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await listCategories();

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const listByStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await listCategoriesByStore(
      req.params.storeId
    );

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await getCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
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
    const category = await updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
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
    const result = await deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
