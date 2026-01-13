import { pool } from "../../config/db.js";

type CreateCategoryPayload = {
  storeId: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  sortOrder?: number;
};

type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  image?: string;
  slug?: string;
  sortOrder?: number;
};

const categorySelectColumns = `
  id,
  store_id,
  name,
  description,
  image,
  slug,
  sort_order,
  created_at
`;

export const createCategory = async (payload: CreateCategoryPayload) => {
  const { storeId, name, description, image, slug, sortOrder } = payload;

  const result = await pool.query(
    `INSERT INTO categories (
      store_id,
      name,
      description,
      image,
      slug,
      sort_order
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING ${categorySelectColumns}`,
    [
      storeId,
      name,
      description ?? null,
      image ?? null,
      slug ?? null,
      sortOrder ?? 0,
    ]
  );

  return result.rows[0];
};

export const listCategories = async () => {
  const result = await pool.query(
    `SELECT ${categorySelectColumns}
     FROM categories
     ORDER BY sort_order ASC, created_at DESC`
  );

  return result.rows;
};

export const listCategoriesByStore = async (storeId: string) => {
  const result = await pool.query(
    `SELECT ${categorySelectColumns}
     FROM categories
     WHERE store_id = $1
     ORDER BY sort_order ASC, created_at DESC`,
    [storeId]
  );

  return result.rows;
};

export const getCategoryById = async (id: string) => {
  const result = await pool.query(
    `SELECT ${categorySelectColumns}
     FROM categories
     WHERE id = $1`,
    [id]
  );

  if (!result.rowCount) {
    throw new Error("Category not found");
  }

  return result.rows[0];
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload
) => {
  const fields: Array<{ column: string; value: string | number | null }> = [];

  if (payload.name !== undefined) {
    fields.push({ column: "name", value: payload.name });
  }
  if (payload.description !== undefined) {
    fields.push({ column: "description", value: payload.description });
  }
  if (payload.image !== undefined) {
    fields.push({ column: "image", value: payload.image });
  }
  if (payload.slug !== undefined) {
    fields.push({ column: "slug", value: payload.slug });
  }
  if (payload.sortOrder !== undefined) {
    fields.push({ column: "sort_order", value: payload.sortOrder });
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
    `UPDATE categories
     SET ${setClause}
     WHERE id = $${values.length}
     RETURNING ${categorySelectColumns}`,
    values
  );

  if (!result.rowCount) {
    throw new Error("Category not found");
  }

  return result.rows[0];
};

export const deleteCategory = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rowCount) {
    throw new Error("Category not found");
  }

  return { id: result.rows[0].id };
};
