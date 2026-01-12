import { pool } from "../../config/db.js";

type CreateStorePayload = {
  ownerId: string;
  storeName: string;
  storeDescription?: string;
  subdomain: string;
  email?: string;
  phone?: string;
  businessType?: string;
  currency?: string;
};

type UpdateStorePayload = {
  storeName?: string;
  storeDescription?: string;
  subdomain?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  currency?: string;
  status?: "active" | "inactive" | "suspended";
};

export const createStore = async (payload: CreateStorePayload) => {
  const {
    ownerId,
    storeName,
    storeDescription,
    subdomain,
    email,
    phone,
    businessType,
    currency,
  } = payload;

  const existingSubdomain = await pool.query(
    "SELECT id FROM stores WHERE subdomain = $1",
    [subdomain]
  );

  if (existingSubdomain.rowCount) {
    throw new Error("Subdomain already in use");
  }

  const result = await pool.query(
    `INSERT INTO stores (
      owner_id,
      store_name,
      store_description,
      subdomain,
      email,
      phone,
      business_type,
      currency,
      total_products,
      total_orders,
      total_revenue
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING
      id,
      owner_id,
      store_name,
      store_description,
      subdomain,
      email,
      phone,
      business_type,
      is_premium,
      premium_expiry,
      currency,
      status,
      total_products,
      total_orders,
      total_revenue,
      created_at`,
    [
      ownerId,
      storeName,
      storeDescription ?? null,
      subdomain,
      email ?? null,
      phone ?? null,
      businessType ?? null,
      currency ?? "BDT",
      0,
      0,
      0,
    ]
  );

  return result.rows[0];
};

const storeSelectColumns = `
  id,
  owner_id,
  store_name,
  store_description,
  subdomain,
  email,
  phone,
  business_type,
  is_premium,
  premium_expiry,
  currency,
  status,
  total_products,
  total_orders,
  total_revenue,
  created_at
`;

export const listStores = async () => {
  const result = await pool.query(
    `SELECT ${storeSelectColumns}
     FROM stores
     ORDER BY created_at DESC`
  );

  return result.rows;
};

export const getStoreById = async (id: string) => {
  const result = await pool.query(
    `SELECT ${storeSelectColumns}
     FROM stores
     WHERE id = $1`,
    [id]
  );

  if (!result.rowCount) {
    throw new Error("Store not found");
  }

  return result.rows[0];
};

export const getStoreBySubdomain = async (subdomain: string) => {
  const result = await pool.query(
    `SELECT ${storeSelectColumns}
     FROM stores
     WHERE subdomain = $1`,
    [subdomain]
  );

  if (!result.rowCount) {
    throw new Error("Store not found");
  }

  return result.rows[0];
};

export const getStoresByOwner = async (ownerId: string) => {
  const result = await pool.query(
    `SELECT ${storeSelectColumns}
     FROM stores
     WHERE owner_id = $1
     ORDER BY created_at DESC`,
    [ownerId]
  );

  return result.rows;
};

export const updateStore = async (
  id: string,
  payload: UpdateStorePayload
) => {
  if (payload.subdomain) {
    const existingSubdomain = await pool.query(
      "SELECT id FROM stores WHERE subdomain = $1 AND id <> $2",
      [payload.subdomain, id]
    );

    if (existingSubdomain.rowCount) {
      throw new Error("Subdomain already in use");
    }
  }

  const fields: Array<{ column: string; value: string }> = [];

  if (payload.storeName !== undefined) {
    fields.push({ column: "store_name", value: payload.storeName });
  }
  if (payload.storeDescription !== undefined) {
    fields.push({
      column: "store_description",
      value: payload.storeDescription,
    });
  }
  if (payload.subdomain !== undefined) {
    fields.push({ column: "subdomain", value: payload.subdomain });
  }
  if (payload.email !== undefined) {
    fields.push({ column: "email", value: payload.email });
  }
  if (payload.phone !== undefined) {
    fields.push({ column: "phone", value: payload.phone });
  }
  if (payload.businessType !== undefined) {
    fields.push({
      column: "business_type",
      value: payload.businessType,
    });
  }
  if (payload.currency !== undefined) {
    fields.push({ column: "currency", value: payload.currency });
  }
  if (payload.status !== undefined) {
    fields.push({ column: "status", value: payload.status });
  }

  if (!fields.length) {
    throw new Error("No fields to update");
  }

  const setClause = fields
    .map((field, index) => `${field.column} = $${index + 1}`)
    .join(", ");

  const values = fields.map((field) => field.value);
  values.push(id);

  const result = await pool.query(
    `UPDATE stores
     SET ${setClause}
     WHERE id = $${values.length}
     RETURNING ${storeSelectColumns}`,
    values
  );

  if (!result.rowCount) {
    throw new Error("Store not found");
  }

  return result.rows[0];
};

export const deleteStore = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM stores WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rowCount) {
    throw new Error("Store not found");
  }

  return { id: result.rows[0].id };
};
