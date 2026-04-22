import { pool } from "../../config/db.js";

export const listOrders = async () => {
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
  return result.rows;
};

export const createOrder = async (payload: {
  customer: string;
  email: string;
  total: string;
  status?: string;
  date?: string;
  productId?: string | null;
  productName?: string | null;
  quantity?: number;
}) => {
  const {
    customer,
    email,
    total,
    status = "Paid",
    date,
    productId = null,
    productName = null,
    quantity = 1,
  } = payload;

  // Ensure columns exist
  await pool.query(
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id VARCHAR(50)"
  );
  await pool.query(
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)"
  );
  await pool.query(
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER"
  );

  const now = new Date();
  const orderId =
    String(Date.now()) +
    String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  const formattedDate =
    date ||
    now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  await pool.query(
    "INSERT INTO orders (id, customer, email, total, status, date, product_id, product_name, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      orderId,
      customer,
      email,
      total,
      status,
      formattedDate,
      productId,
      productName,
      quantity,
    ]
  );

  return { id: orderId };
};

export const updateOrderStatus = async (id: string, status: string) => {
  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rowCount === 0) {
    throw new Error("Order not found");
  }

  return result.rows[0];
};
