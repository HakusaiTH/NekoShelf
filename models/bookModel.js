// models/bookModel.js
// MODEL: Interacts with the 'books' table in SQLite with JOIN queries to authors & categories.

const db = require('../config/db');

const BookModel = {
  // READ - Get all books with joined author and category names
  getAll: (searchQuery, categoryId, callback) => {
    if (typeof searchQuery === 'function') {
      callback = searchQuery;
      searchQuery = null;
      categoryId = null;
    } else if (typeof categoryId === 'function') {
      callback = categoryId;
      categoryId = null;
    }

    let sql = `
      SELECT b.*, 
             a.name AS author_name, 
             c.name AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      sql += ` AND (b.title LIKE ? OR a.name LIKE ? OR b.isbn LIKE ?)`;
      const term = `%${searchQuery}%`;
      params.push(term, term, term);
    }

    if (categoryId) {
      sql += ` AND b.category_id = ?`;
      params.push(categoryId);
    }

    sql += ` ORDER BY b.id DESC`;

    db.all(sql, params, callback);
  },

  // READ - Get single book by ID
  getById: (id, callback) => {
    const sql = `
      SELECT b.*, 
             a.name AS author_name, 
             c.name AS category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // CREATE
  create: (book, callback) => {
    const { title, author_id, category_id, isbn, published_year, total_copies, available_copies, cover_image, description } = book;
    const total = parseInt(total_copies) || 1;
    const avail = available_copies !== undefined ? parseInt(available_copies) : total;

    db.run(
      `INSERT INTO books 
       (title, author_id, category_id, isbn, published_year, total_copies, available_copies, cover_image, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author_id || null, category_id || null, isbn || null, published_year || null, total, avail, cover_image || null, description || null],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  // UPDATE
  update: (id, book, callback) => {
    const { title, author_id, category_id, isbn, published_year, total_copies, available_copies, cover_image, description } = book;
    const total = parseInt(total_copies) || 1;

    if (cover_image !== undefined) {
      db.run(
        `UPDATE books 
         SET title = ?, author_id = ?, category_id = ?, isbn = ?, published_year = ?, total_copies = ?, available_copies = ?, cover_image = ?, description = ? 
         WHERE id = ?`,
        [title, author_id || null, category_id || null, isbn || null, published_year || null, total, available_copies, cover_image, description || null, id],
        callback
      );
    } else {
      db.run(
        `UPDATE books 
         SET title = ?, author_id = ?, category_id = ?, isbn = ?, published_year = ?, total_copies = ?, available_copies = ?, description = ? 
         WHERE id = ?`,
        [title, author_id || null, category_id || null, isbn || null, published_year || null, total, available_copies, description || null, id],
        callback
      );
    }
  },

  // Adjust available copies (for loan/return)
  adjustAvailableCopies: (bookId, delta, callback) => {
    db.run(
      `UPDATE books SET available_copies = available_copies + ? WHERE id = ?`,
      [delta, bookId],
      callback
    );
  },

  // DELETE
  delete: (id, callback) => {
    db.run('DELETE FROM books WHERE id = ?', [id], callback);
  }
};

module.exports = BookModel;
