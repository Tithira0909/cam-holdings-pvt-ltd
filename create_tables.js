import { query } from './server/db.js';

async function run() {
  await query(`
    CREATE TABLE IF NOT EXISTS email_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mailer VARCHAR(255) DEFAULT 'smtp',
      host VARCHAR(255),
      port INTEGER,
      username VARCHAR(255),
      password VARCHAR(255),
      encryption VARCHAR(255),
      from_address VARCHAR(255),
      from_name VARCHAR(255),
      status VARCHAR(20) DEFAULT 'Inactive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add columns to inquiries table
  try {
    await query("ALTER TABLE inquiries ADD COLUMN reply_subject TEXT;");
  } catch (e) { console.log(e.message); }

  try {
    await query("ALTER TABLE inquiries ADD COLUMN reply_message TEXT;");
  } catch (e) { console.log(e.message); }

  try {
    await query("ALTER TABLE inquiries ADD COLUMN replied_at DATETIME;");
  } catch (e) { console.log(e.message); }

  console.log("Migration complete");
}

run();
