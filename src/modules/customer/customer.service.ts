import { pool } from "../../config/db.js";

export const listCustomers = async () => {
  const result = await pool.query(
    "SELECT * FROM customers ORDER BY created_at DESC"
  );
  return result.rows;
};

export const createCustomer = async (payload: {
  name: string;
  email: string;
  spent: string;
  joined: string;
}) => {
  const { name, email, spent, joined } = payload;
  const id =
    "C" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

  await pool.query(
    "INSERT INTO customers (id, name, email, spent, joined) VALUES ($1, $2, $3, $4, $5)",
    [id, name, email, spent, joined]
  );

  return { id };
};

export const deleteCustomer = async (id: string) => {
  await pool.query("DELETE FROM customers WHERE id = $1", [id]);
  return { id };
};
