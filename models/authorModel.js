// models/authorModel.js
// MODEL: Manages the 'authors' table

const db = require('../config/db');

const AuthorModel = {
  getAll: (callback) => {
    const sql = `
      SELECT a.*, COUNT(b.id) AS book_count
      FROM authors a
      LEFT JOIN books b ON a.id = b.author_id
      GROUP BY a.id
      ORDER BY a.name ASC
    `;
    db.all(sql, [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM authors WHERE id = ?', [id], callback);
  },

  getBooksByAuthor: (authorId, callback) => {
    const sql = `
      SELECT b.*, c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.author_id = ?
      ORDER BY b.title ASC
    `;
    db.all(sql, [authorId], callback);
  },

  create: (author, callback) => {
    const { name, bio } = author;
    db.run(
      'INSERT INTO authors (name, bio) VALUES (?, ?)',
      [name, bio || null],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  update: (id, author, callback) => {
    const { name, bio } = author;
    db.run(
      'UPDATE authors SET name = ?, bio = ? WHERE id = ?',
      [name, bio || null, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM authors WHERE id = ?', [id], callback);
  }
};

module.exports = AuthorModel;
