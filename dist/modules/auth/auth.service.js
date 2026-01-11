import { pool } from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
export const registerUser = async (payload) => {
    const { email, password, name, phone, role } = payload;
    const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rowCount) {
        throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(`INSERT INTO users (email, password, name, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, role`, [email, hashedPassword, name, phone, role]);
    const user = result.rows[0];
    const token = signToken({
        userId: user.id,
        role: user.role,
    });
    return { user, token };
};
export const loginUser = async (payload) => {
    const { email, password } = payload;
    const result = await pool.query("SELECT id, email, password, role FROM users WHERE email = $1", [email]);
    if (!result.rowCount) {
        throw new Error("Invalid email or password");
    }
    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const token = signToken({
        userId: user.id,
        role: user.role,
    });
    delete user.password;
    return { user, token };
};
//# sourceMappingURL=auth.service.js.map