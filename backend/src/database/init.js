const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Allow overriding DB path via env (useful for Railway volumes). Fallback to repo database.sqlite
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`✅ Connected to SQLite database at: ${DB_PATH}`);
  }
});

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // QR Codes table
    db.run(`
      CREATE TABLE IF NOT EXISTS qr_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        original_url TEXT NOT NULL,
        current_url TEXT NOT NULL,
        qr_image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // Analytics table
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        qr_code_id INTEGER,
        ip_address TEXT,
        user_agent TEXT,
        device_type TEXT,
        country TEXT,
        city TEXT,
        referrer TEXT,
        scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (qr_code_id) REFERENCES qr_codes (id)
      )
    `);

    // Create indexes for better performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_short_code ON qr_codes(short_code)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_qr_analytics ON analytics(qr_code_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_scan_date ON analytics(scanned_at)`);
  });
};

module.exports = { db, initDatabase, DB_PATH };