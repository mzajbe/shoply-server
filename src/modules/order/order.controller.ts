import type { Request, Response, NextFunction } from "express";
import {
  listOrders,
  createOrder,
  updateOrderStatus,
} from "./order.service.js";

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await listOrders();
    res.status(200).json(orders);
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
    const {
      customer,
      email,
      total,
      status,
      date,
      productId,
      productName,
      quantity,
    } = req.body || {};

    if (!customer || !email || !total) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const result = await createOrder({
      customer,
      email,
      total,
      status,
      date,
      productId,
      productName,
      quantity,
    });

    res.status(200).json({ id: result.id });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, status } = req.body || {};

    if (!id || !status) {
      res.status(400).json({ message: "Missing id or status" });
      return;
    }

    const order = await updateOrderStatus(id, status);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
