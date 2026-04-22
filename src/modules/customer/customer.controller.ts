import type { Request, Response, NextFunction } from "express";
import {
  listCustomers,
  createCustomer,
  deleteCustomer,
} from "./customer.service.js";

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await listCustomers();
    res.status(200).json(customers);
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
    const { name, email, spent, joined } = req.body;

    const result = await createCustomer({ name, email, spent, joined });
    res.status(201).json({ message: "Customer created", id: result.id });
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

    await deleteCustomer(id);
    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
};
