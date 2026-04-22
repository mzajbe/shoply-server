import type { Request, Response, NextFunction } from "express";
import {
  listCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "./marketing.service.js";

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaigns = await listCampaigns();
    res.status(200).json(campaigns);
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
    const { name, type, status } = req.body;

    const result = await createCampaign({ name, type, status });
    res.status(201).json({ message: "Campaign created", id: result.id });
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
    const { id, name, type, status } = req.body;

    await updateCampaign({ id, name, type, status });
    res.status(200).json({ message: "Campaign updated" });
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

    await deleteCampaign(id);
    res.status(200).json({ message: "Campaign deleted" });
  } catch (error) {
    next(error);
  }
};
