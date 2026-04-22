import { pool } from "../../config/db.js";

type ProductPayload = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  imageUrl?: string | null;
};

async function ensureImageColumn() {
  const client = await pool.connect();
  try {
    await client.query(
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT"
    );
  } finally {
    client.release();
  }
}

export const listProducts = async () => {
  await ensureImageColumn();
  const result = await pool.query(
    'SELECT id, name, sku, category, price, stock, status, image_url as "imageUrl", created_at FROM products ORDER BY created_at DESC'
  );
  return result.rows;
};

export const createProduct = async (
  data: ProductPayload,
  imageUrl: string | null
) => {
  await ensureImageColumn();
  const { name, sku, category, price, stock, status } = data;
  const id =
    "P" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

  const finalImageUrl = imageUrl || (data.imageUrl?.trim() ? data.imageUrl : null);

  await pool.query(
    "INSERT INTO products (id, name, sku, category, price, stock, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [id, name, sku, category, price, stock, status, finalImageUrl]
  );

  return { id };
};

export const updateProduct = async (
  id: string,
  data: ProductPayload,
  imageUrl: string | null
) => {
  await ensureImageColumn();
  const { name, sku, category, price, stock, status } = data;
  const finalImageUrl = imageUrl || (data.imageUrl?.trim() ? data.imageUrl : null);

  await pool.query(
    "UPDATE products SET name=$1, sku=$2, category=$3, price=$4, stock=$5, status=$6, image_url=$7 WHERE id=$8",
    [name, sku, category, price, stock, status, finalImageUrl, id]
  );

  return { id };
};

export const deleteProduct = async (id: string) => {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return { id };
};
