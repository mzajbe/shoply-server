import type { Request, Response, NextFunction } from "express";
import {
  createStore,
  listStores,
  getStoreById,
  getStoreBySubdomain,
  getStoresByOwner,
  updateStore,
  deleteStore,
} from "./store.service.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      ownerId,
      storeName,
      storeDescription,
      subdomain,
      email,
      phone,
      businessType,
      currency,
    } = req.body;

    if (!ownerId || !storeName || !subdomain) {
      throw new Error("ownerId, storeName, and subdomain are required");
    }

    const store = await createStore({
      ownerId,
      storeName,
      storeDescription,
      subdomain,
      email,
      phone,
      businessType,
      currency,
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store,
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
    const stores = await listStores();

    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: stores,
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
    const store = await getStoreById(req.params.id as string);
    console.log(store);
    

    res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

export const getBySubdomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const store = await getStoreBySubdomain(req.params.subdomain);

    res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

export const listByOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stores = await getStoresByOwner(req.params.ownerId);

    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: stores,
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
    const store = await updateStore(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      data: store,
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
    const result = await deleteStore(req.params.id);

    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
