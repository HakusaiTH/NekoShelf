-- Relational database schema for the Book Library exercise
-- This is created automatically by config/db.js on first run,
-- but it's kept here as a reference / for manual inspection.

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    published_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
