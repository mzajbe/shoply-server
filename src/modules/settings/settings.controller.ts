import type { Request, Response, NextFunction } from "express";
import { getSettings, updateSettings } from "./settings.service.js";

export const get = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await getSettings();
    res.status(200).json(settings);
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
    const {
      store_name,
      currency,
      email,
      payment_stripe,
      payment_sslcommerze,
      payment_aamarpay,
      shipping_rate,
      notifications_email,
    } = req.body;

    await updateSettings({
      store_name,
      currency,
      email,
      payment_stripe,
      payment_sslcommerze,
      payment_aamarpay,
      shipping_rate,
      notifications_email,
    });

    res.status(200).json({ message: "Settings updated" });
  } catch (error) {
    next(error);
  }
};
