// models/bookModel.js
// MODEL: talks directly to the relational database.
// The controller never writes SQL itself - it always goes through the model.

const db = require('../config/db');

const BookModel = {
  // READ - all books
  getAll: (callback) => {
    db.all('SELECT * FROM books ORDER BY id DESC', [], callback);
  },

  // READ - a single book by id
  getById: (id, callback) => {
    db.get('SELECT * FROM books WHERE id = ?', [id], callback);
  },

  // CREATE
  create: (book, callback) => {
    const { title, author, genre, published_year, cover_image, description } = book;
    db.run(
      'INSERT INTO books (title, author, genre, published_year, cover_image, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, genre, published_year, cover_image || null, description || null],
      function (err) {
        // `this.lastID` gives the id of the newly inserted row
        callback(err, this ? this.lastID : null);
      }
    );
  },

  // UPDATE
  update: (id, book, callback) => {
    const { title, author, genre, published_year, cover_image, description } = book;
    if (cover_image !== undefined) {
      db.run(
        'UPDATE books SET title = ?, author = ?, genre = ?, published_year = ?, cover_image = ?, description = ? WHERE id = ?',
        [title, author, genre, published_year, cover_image, description || null, id],
        callback
      );
    } else {
      db.run(
        'UPDATE books SET title = ?, author = ?, genre = ?, published_year = ?, description = ? WHERE id = ?',
        [title, author, genre, published_year, description || null, id],
        callback
      );
    }
  },

  // DELETE
  delete: (id, callback) => {
    db.run('DELETE FROM books WHERE id = ?', [id], callback);
  },
};

module.exports = BookModel;
