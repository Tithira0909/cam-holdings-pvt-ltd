import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;
let sqliteDb;

// Unified query function
export const query = async (sql, params = []) => {
    if (process.env.DB_CLIENT === 'sqlite') {
        if (!sqliteDb) {
            sqliteDb = await open({
                filename: process.env.DB_FILE || path.join(__dirname, '../../database/database.sqlite'),
                driver: sqlite3.Database
            });
        }

        // SQLite doesn't support '?' as placeholder in all contexts the same way or expects different execution methods
        // But better-sqlite3 and sqlite package support '?' binding.

        try {
            if (sql.trim().toLowerCase().startsWith('select')) {
                const rows = await sqliteDb.all(sql, params);
                return rows;
            } else {
                const result = await sqliteDb.run(sql, params);
                // Return MySQL-like result object for compatibility
                // result has lastID and changes
                return {
                    insertId: result.lastID,
                    affectedRows: result.changes,
                };
            }
        } catch (err) {
            console.error('SQLite Error:', err);
            throw err;
        }
    } else {
        // MySQL
        if (!pool) {
            pool = mysql.createPool(dbConfig);
        }
        try {
            const [results, ] = await pool.execute(sql, params);
            return results;
        } catch (err) {
            console.error('MySQL Error:', err);
            throw err;
        }
    }
};

export default { query };
