import { pool } from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

export const registerUser = async (payload: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: "customer" | "seller";
}) => {
  const { email, password, name, phone, role } = payload;

  const userExists = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (userExists.rowCount) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (email, password, name, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, name, role`,
    [email, hashedPassword, name || null, phone || null, role || "customer"]
  );

  const user = result.rows[0];

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const result = await pool.query(
    "SELECT id, email, password, name, role FROM users WHERE email = $1",
    [email]
  );

  if (!result.rowCount) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  // Remove password from response
  const { password: _, ...userInfo } = user;

  return { user: userInfo, token };
};

export const getUserById = async (userId: string) => {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [userId]
  );

  if (!result.rowCount) {
    return null;
  }

  return result.rows[0];
};
