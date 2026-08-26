// config/db.js
// Relational SQLite Database Connection & Schema Setup for Multi-Table Library System

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  // Enable Foreign Keys in SQLite
  db.run('PRAGMA foreign_keys = ON;');

  // 1. AUTHORS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. CATEGORIES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. BOOKS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author_id INTEGER,
      category_id INTEGER,
      isbn TEXT,
      published_year INTEGER,
      total_copies INTEGER DEFAULT 1,
      available_copies INTEGER DEFAULT 1,
      cover_image TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // 4. MEMBERS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. LOANS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      member_id INTEGER NOT NULL,
      borrow_date DATE DEFAULT (DATE('now')),
      due_date DATE NOT NULL,
      return_date DATE,
      status TEXT DEFAULT 'borrowed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    )
  `);

  // 6. USERS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration check for books table columns if existing database had old structure
  db.all("PRAGMA table_info(books)", (err, columns) => {
    if (!err && columns) {
      const colNames = columns.map((c) => c.name);
      if (!colNames.includes('author_id')) {
        db.run("ALTER TABLE books ADD COLUMN author_id INTEGER");
      }
      if (!colNames.includes('category_id')) {
        db.run("ALTER TABLE books ADD COLUMN category_id INTEGER");
      }
      if (!colNames.includes('isbn')) {
        db.run("ALTER TABLE books ADD COLUMN isbn TEXT");
      }
      if (!colNames.includes('total_copies')) {
        db.run("ALTER TABLE books ADD COLUMN total_copies INTEGER DEFAULT 1");
      }
      if (!colNames.includes('available_copies')) {
        db.run("ALTER TABLE books ADD COLUMN available_copies INTEGER DEFAULT 1");
      }
    }
  });

  // Seed Users if Users table is empty
  const bcrypt = require('bcryptjs');
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding initial admin and user accounts...');
      const adminPassHash = bcrypt.hashSync('admin123', 10);
      const userPassHash = bcrypt.hashSync('user123', 10);

      const userStmt = db.prepare('INSERT INTO users (username, email, password, role, name) VALUES (?, ?, ?, ?, ?)');
      userStmt.run('admin', 'admin@library.com', adminPassHash, 'admin', 'System Administrator');
      userStmt.run('user', 'user@library.com', userPassHash, 'user', 'Regular Member');
      userStmt.finalize();
    }
  });

  // SEED DATA INITIALIZATION IF EMPTY
  db.get('SELECT COUNT(*) as count FROM authors', [], (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding relational initial data...');

      db.serialize(() => {
        // Seed Authors
        const authorStmt = db.prepare('INSERT INTO authors (id, name, bio) VALUES (?, ?, ?)');
        authorStmt.run(1, 'Robert C. Martin', 'Software engineer, author of Clean Code series.');
        authorStmt.run(2, 'George Orwell', 'English novelist famous for 1984 and Animal Farm.');
        authorStmt.run(3, 'Harper Lee', 'American novelist widely known for To Kill a Mockingbird.');
        authorStmt.run(4, 'Martin Kleppmann', 'Distributed systems researcher at Cambridge.');
        authorStmt.run(5, 'F. Scott Fitzgerald', 'American novelist famous for The Great Gatsby.');
        authorStmt.finalize();

        // Seed Categories
        const catStmt = db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)');
        catStmt.run(1, 'Technology & Programming', 'Software design, computer science, and tech architecture.');
        catStmt.run(2, 'Dystopian & Sci-Fi', 'Speculative fiction, futuristic and dystopian themes.');
        catStmt.run(3, 'Classic Literature', 'Timeless literary masterpieces and historic novels.');
        catStmt.run(4, 'Fiction', 'General narrative prose fiction.');
        catStmt.finalize();

        // Seed Members
        const memStmt = db.prepare('INSERT INTO members (id, member_code, name, email, phone) VALUES (?, ?, ?, ?, ?)');
        memStmt.run(1, 'MEM-1001', 'Somchai Srisuk', 'somchai@example.com', '081-234-5678');
        memStmt.run(2, 'MEM-1002', 'Jane Doe', 'jane.doe@example.com', '089-876-5432');
        memStmt.run(3, 'MEM-1003', 'Alice Smith', 'alice@example.com', '082-111-2222');
        memStmt.finalize();

        // Seed Books
        const bookStmt = db.prepare('INSERT INTO books (id, title, author_id, category_id, isbn, published_year, total_copies, available_copies, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        bookStmt.run(1, 'Clean Code', 1, 1, '978-0132350884', 2008, 5, 4, 'A Handbook of Agile Software Craftsmanship.');
        bookStmt.run(2, '1984', 2, 2, '978-0451524935', 1949, 3, 2, 'A dystopian social science fiction novel about totalitarianism.');
        bookStmt.run(3, 'To Kill a Mockingbird', 3, 4, '978-0061120084', 1960, 4, 4, 'A classic of modern American literature.');
        bookStmt.run(4, 'Designing Data-Intensive Applications', 4, 1, '978-1449373320', 2017, 3, 3, 'The big ideas behind reliable, scalable, and maintainable systems.');
        bookStmt.run(5, 'The Great Gatsby', 5, 3, '978-0743273565', 1925, 2, 1, 'The story of Jay Gatsby and Daisy Buchanan.');
        bookStmt.finalize();

        // Seed Loans
        const loanStmt = db.prepare('INSERT INTO loans (id, book_id, member_id, borrow_date, due_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
        loanStmt.run(1, 1, 1, '2026-08-10', '2026-08-24', null, 'overdue');
        loanStmt.run(2, 2, 2, '2026-08-20', '2026-09-03', null, 'borrowed');
        loanStmt.run(3, 5, 3, '2026-08-15', '2026-08-29', '2026-08-22', 'returned');
        loanStmt.finalize(() => {
          console.log('Seeding of relational library database complete.');
        });
      });
    }
  });
});

module.exports = db;
