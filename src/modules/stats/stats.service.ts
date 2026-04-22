import { pool } from "../../config/db.js";

export const getStats = async () => {
  const result = await pool.query("SELECT * FROM stats");
  return result.rows;
};
