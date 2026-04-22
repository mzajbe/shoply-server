import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

// Use DATABASE_URL (connection string) if available, else individual vars
export const pool = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL })
  : new Pool({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    });
