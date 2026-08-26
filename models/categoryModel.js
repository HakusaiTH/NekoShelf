// models/categoryModel.js
// MODEL: Manages the 'categories' table

const db = require('../config/db');

const CategoryModel = {
  getAll: (callback) => {
    const sql = `
      SELECT c.*, COUNT(b.id) AS book_count
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    db.all(sql, [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM categories WHERE id = ?', [id], callback);
  },

  getBooksByCategory: (categoryId, callback) => {
    const sql = `
      SELECT b.*, a.name AS author_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      WHERE b.category_id = ?
      ORDER BY b.title ASC
    `;
    db.all(sql, [categoryId], callback);
  },

  create: (category, callback) => {
    const { name, description } = category;
    db.run(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  update: (id, category, callback) => {
    const { name, description } = category;
    db.run(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM categories WHERE id = ?', [id], callback);
  }
};

module.exports = CategoryModel;
