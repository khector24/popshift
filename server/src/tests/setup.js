import { afterAll } from "vitest";
import pool from "../db/index.js";

afterAll(async () => {
  await pool.end();
});
