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
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    // Seed default sample books if table is empty
    db.get('SELECT COUNT(*) as count FROM books', [], (err, row) => {
      if (!err && row && row.count === 0) {
        const seedBooks = [
          ['Clean Code', 'Robert C. Martin', 'Technology', 2008],
          ['The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925],
          ['1984', 'George Orwell', 'Dystopian', 1949],
          ['To Kill a Mockingbird', 'Harper Lee', 'Fiction', 1960],
          ['Designing Data-Intensive Applications', 'Martin Kleppmann', 'Technology', 2017]
        ];
        const stmt = db.prepare('INSERT INTO books (title, author, genre, published_year) VALUES (?, ?, ?, ?)');
        seedBooks.forEach((book) => stmt.run(book));
        stmt.finalize(() => console.log('Seeded initial sample books into database.'));
      }
    });
  }
});

module.exports = db;
