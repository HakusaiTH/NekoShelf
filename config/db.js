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
    cover_image TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.run(initSql, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    // Migration check: Ensure cover_image and description columns exist
    db.all("PRAGMA table_info(books)", (err, columns) => {
      if (!err && columns) {
        const colNames = columns.map((c) => c.name);
        if (!colNames.includes('cover_image')) {
          db.run("ALTER TABLE books ADD COLUMN cover_image TEXT", () => {
            console.log('Added cover_image column to books table.');
          });
        }
        if (!colNames.includes('description')) {
          db.run("ALTER TABLE books ADD COLUMN description TEXT", () => {
            console.log('Added description column to books table.');
          });
        }
      }
    });

    // Seed default sample books if table is empty
    db.get('SELECT COUNT(*) as count FROM books', [], (err, row) => {
      if (!err && row && row.count === 0) {
        const seedBooks = [
          ['Clean Code', 'Robert C. Martin', 'Technology', 2008, null, 'A Handbook of Agile Software Craftsmanship. Clean Code is divided into three parts. The first describes the principles, patterns, and practices of writing clean code.'],
          ['The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925, null, 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.'],
          ['1984', 'George Orwell', 'Dystopian', 1949, null, 'A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation.'],
          ['To Kill a Mockingbird', 'Harper Lee', 'Fiction', 1960, null, 'A classic of modern American literature, dealing with serious issues of rape and racial inequality.'],
          ['Designing Data-Intensive Applications', 'Martin Kleppmann', 'Technology', 2017, null, 'The big ideas behind reliable, scalable, and maintainable systems.']
        ];
        const stmt = db.prepare('INSERT INTO books (title, author, genre, published_year, cover_image, description) VALUES (?, ?, ?, ?, ?, ?)');
        seedBooks.forEach((book) => stmt.run(book));
        stmt.finalize(() => console.log('Seeded initial sample books into database.'));
      }
    });
  }
});

module.exports = db;
