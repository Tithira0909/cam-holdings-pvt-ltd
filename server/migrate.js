import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { query } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    console.log('Running migration...');
    const client = process.env.DB_CLIENT || 'sqlite';
    const schemaFile = client === 'sqlite' ? 'sqlite_schema.sql' : 'schema.sql';

    // Look for schema in root/database or server/database
    let dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
        dbDir = path.join(__dirname, 'database');
    }

    const schemaPath = path.join(dbDir, schemaFile);
    const seedPath = path.join(dbDir, 'seed.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error(`Schema file not found at ${schemaPath}`);
        process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    try {
        if (client === 'sqlite') {
            const dbPath = process.env.DB_FILE || './database/database.sqlite';
            // Ensure directory exists
            const dbDirname = path.dirname(dbPath);
            if (!fs.existsSync(dbDirname)) {
                fs.mkdirSync(dbDirname, { recursive: true });
            }

            const db = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });

            console.log(`Applying schema to SQLite DB at ${dbPath}...`);
            await db.exec(schemaSql);
            console.log('Schema applied.');

            // Check count
            const res = await db.get('SELECT count(*) as count FROM lands');
            if (res.count === 0 && fs.existsSync(seedPath)) {
                console.log('Seeding...');
                const seedSql = fs.readFileSync(seedPath, 'utf8');
                // Split by semicolon for sqlite just in case exec handles only one?
                // sqlite node driver `exec` handles multiple statements separated by semicolon.
                await db.exec(seedSql);
                console.log('Seeded.');
            } else {
                console.log(`Skipping seed (count: ${res.count}).`);
            }
            await db.close();
        } else {
            // MySQL
            console.log('Applying schema to MySQL...');
            const statements = schemaSql.split(';').filter(s => s.trim().length > 0);
            for (const sql of statements) {
                await query(sql);
            }
            console.log('Schema applied.');

            const res = await query('SELECT count(*) as count FROM lands');
            if (res[0].count === 0 && fs.existsSync(seedPath)) {
                console.log('Seeding...');
                const seedSql = fs.readFileSync(seedPath, 'utf8');
                const seedStatements = seedSql.split(';').filter(s => s.trim().length > 0);
                for (const sql of seedStatements) {
                    await query(sql);
                }
                console.log('Seeded.');
            }
        }
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
