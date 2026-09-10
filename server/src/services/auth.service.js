import bcrypt from "bcrypt";
import pool from "../db/index.js";

export async function authenticateUser(email, password) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
  ]);

  const user = result.rows[0];

  if (!user || !user.is_active) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
