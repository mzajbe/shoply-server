import { pool } from "../../config/db.js";

export const getThemeConfig = async (userId: string) => {
  const result = await pool.query(
    "SELECT content FROM projects WHERE user_id = $1 AND name = $2",
    [userId, "Shoply Store"]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].content;
};

export const saveThemeConfig = async (userId: string, config: unknown) => {
  const checkResult = await pool.query(
    "SELECT id FROM projects WHERE user_id = $1 AND name = $2",
    [userId, "Shoply Store"]
  );

  if (checkResult.rows.length === 0) {
    // INSERT
    await pool.query(
      "INSERT INTO projects (user_id, name, content) VALUES ($1, $2, $3)",
      [userId, "Shoply Store", config]
    );
    return { message: "Project created and saved" };
  } else {
    // UPDATE
    await pool.query(
      "UPDATE projects SET content = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND name = $2",
      [userId, "Shoply Store", config]
    );
    return { message: "Project updated successfully" };
  }
};
