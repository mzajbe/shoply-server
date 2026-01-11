import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,

  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: "7d" as SignOptions["expiresIn"],
};
