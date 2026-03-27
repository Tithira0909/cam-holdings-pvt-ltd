import mysql from "mysql2/promise";
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

async function getMysqlPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Unified query function
export const query = async (sql, params = []) => {
  // Safely convert any undefined parameters to null for MySQL compatibility
  const safeParams = params.map(param => param === undefined ? null : param);

  try {
    const mysqlPool = await getMysqlPool();
    const [results] = await mysqlPool.execute(sql, safeParams);
    return results;
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
};

export default { query };