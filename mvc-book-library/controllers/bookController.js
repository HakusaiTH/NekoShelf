// controllers/bookController.js
// CONTROLLER: receives HTTP requests, talks to the Model,
// then chooses which View to render (or redirects).

const BookModel = require('../models/bookModel');

const BookController = {
  // GET / -> list all books
  index: (req, res) => {
    BookModel.getAll((err, books) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('index', { books, title: 'My Book Library' });
    });
  },

  // GET /books/add -> show the "add book" form
  showAddForm: (req, res) => {
    res.render('add', { title: 'Add a New Book' });
  },

  // POST /books -> create a new book, then redirect to list
  create: (req, res) => {
    const { title, author, genre, published_year } = req.body;

    if (!title || !author) {
      return res.status(400).send('Title and Author are required.');
    }

    BookModel.create({ title, author, genre, published_year }, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/');
    });
  },

  // GET /books/:id/edit -> show the "edit book" form pre-filled
  showEditForm: (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!book) return res.status(404).send('Book not found');
      res.render('edit', { book, title: 'Edit Book' });
    });
  },

  // PUT /books/:id -> update an existing book
  update: (req, res) => {
    const { id } = req.params;
    const { title, author, genre, published_year } = req.body;

    BookModel.update(id, { title, author, genre, published_year }, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/');
    });
  },

  // DELETE /books/:id -> remove a book
  destroy: (req, res) => {
    const { id } = req.params;
    BookModel.delete(id, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/');
    });
  },
};

module.exports = BookController;
