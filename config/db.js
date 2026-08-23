// config/db.js
// Sets up the connection to our relational database (SQLite).
// SQLite stores the whole database in a single file: database/library.db

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Create the "books" table if it doesn't exist yet.
const initSql = `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    published_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.run(initSql, (err) => {
  if (err) console.error('Error creating table:', err.message);
});

module.exports = db;
