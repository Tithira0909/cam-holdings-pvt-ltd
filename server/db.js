import mysql from "mysql2/promise";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let sqliteDb = null;

async function getSqliteDb() {
  if (!sqliteDb) {
    sqliteDb = await open({
      filename:
        process.env.DB_FILE ||
        path.join(__dirname, "../database/database.sqlite"),
      driver: sqlite3.Database,
    });
  }
  return sqliteDb;
}

async function getMysqlPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Unified query function
export const query = async (sql, params = []) => {
  const client = (process.env.DB_CLIENT || "mysql").toLowerCase();

  // Safely convert any undefined parameters to null for MySQL compatibility
  const safeParams = params.map(param => param === undefined ? null : param);

  try {
    if (client === "sqlite") {
      const db = await getSqliteDb();
      const isSelect = sql.trim().toLowerCase().startsWith("select");

      if (isSelect) {
        return await db.all(sql, safeParams);
      }

      const result = await db.run(sql, safeParams);
      return {
        insertId: result.lastID,
        affectedRows: result.changes,
      };
    }

    // MySQL (default)
    const mysqlPool = await getMysqlPool();
    const [results] = await mysqlPool.execute(sql, safeParams);
    return results;
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
};

export default { query };