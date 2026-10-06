import "dotenv/config";
import fs from "fs";
import pg from "pg";

const { Pool } = pg;

const ssl =
  process.env.NODE_ENV === "production"
    ? {
        ca: fs.readFileSync(
          new URL("../config/certs/rds-global-bundle.pem", import.meta.url),
          "utf8",
        ),
        rejectUnauthorized: true,
      }
    : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

export default pool;
