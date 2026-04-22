import { pool } from "../../config/db.js";

export const listCampaigns = async () => {
  const result = await pool.query(
    "SELECT * FROM campaigns ORDER BY created_at DESC"
  );
  return result.rows;
};

export const createCampaign = async (payload: {
  name: string;
  type: string;
  status: string;
}) => {
  const { name, type, status } = payload;
  const id =
    "M" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

  await pool.query(
    "INSERT INTO campaigns (id, name, type, status) VALUES ($1, $2, $3, $4)",
    [id, name, type, status]
  );

  return { id };
};

export const updateCampaign = async (payload: {
  id: string;
  name: string;
  type: string;
  status: string;
}) => {
  const { id, name, type, status } = payload;

  await pool.query(
    "UPDATE campaigns SET name=$1, type=$2, status=$3 WHERE id=$4",
    [name, type, status, id]
  );

  return { id };
};

export const deleteCampaign = async (id: string) => {
  await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);
  return { id };
};
