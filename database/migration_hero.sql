ALTER TABLE services ADD COLUMN is_featured BOOLEAN DEFAULT 0;

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_name TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_settings (key_name, value) VALUES ('hero_image', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600');
