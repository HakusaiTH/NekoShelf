// controllers/bookController.js
// CONTROLLER: receives HTTP requests, talks to the Model,
// then chooses which View to render (or redirects).

const BookModel = require('../models/bookModel');

const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Technology',
  'Classic',
  'Dystopian',
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Romance',
  'Biography',
  'History',
  'Other'
];

const BookController = {
  // GET / -> list all books
  index: (req, res) => {
    BookModel.getAll((err, books) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('index', { books, title: 'My Book Library', genres: GENRES });
    });
  },

  // GET /books/add -> show the "add book" form
  showAddForm: (req, res) => {
    res.render('add', { title: 'Add a New Book', genres: GENRES, error: null, formData: {} });
  },

  // POST /books -> create a new book, then redirect to list
  create: (req, res) => {
    if (req.uploadError) {
      return res.status(400).render('add', {
        title: 'Add a New Book',
        genres: GENRES,
        error: req.uploadError,
        formData: req.body || {}
      });
    }

    const { title, author, genre, published_year, description } = req.body || {};

    if (!title || !author || !title.trim() || !author.trim()) {
      return res.status(400).render('add', {
        title: 'Add a New Book',
        genres: GENRES,
        error: 'Title and Author are required.',
        formData: req.body || {}
      });
    }

    const cover_image = req.file ? '/uploads/' + req.file.filename : null;

    BookModel.create({ title, author, genre, published_year, cover_image, description }, (err) => {
      if (err) {
        return res.status(500).render('add', {
          title: 'Add a New Book',
          genres: GENRES,
          error: 'Database error: ' + err.message,
          formData: req.body || {}
        });
      }
      res.redirect('/');
    });
  },

  // GET /books/:id/edit -> show the "edit book" form pre-filled
  showEditForm: (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!book) return res.status(404).send('Book not found');
      res.render('edit', { book, title: 'Edit Book', genres: GENRES, error: null });
    });
  },

  // GET /books/:id/json -> API endpoint for book details modal
  getDetailJson: (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    });
  },

  // PUT /books/:id -> update an existing book
  update: (req, res) => {
    const { id } = req.params;
    const { title, author, genre, published_year, description, existing_cover_image } = req.body || {};

    if (req.uploadError) {
      return res.status(400).render('edit', {
        book: { id, title, author, genre, published_year, description, cover_image: existing_cover_image },
        title: 'Edit Book',
        genres: GENRES,
        error: req.uploadError
      });
    }

    if (!title || !author || !title.trim() || !author.trim()) {
      return res.status(400).render('edit', {
        book: { id, title, author, genre, published_year, description, cover_image: existing_cover_image },
        title: 'Edit Book',
        genres: GENRES,
        error: 'Title and Author are required.'
      });
    }

    let cover_image;
    if (req.file) {
      cover_image = '/uploads/' + req.file.filename;
    } else if (existing_cover_image !== undefined) {
      cover_image = existing_cover_image;
    }

    BookModel.update(id, { title, author, genre, published_year, cover_image, description }, (err) => {
      if (err) {
        return res.status(500).render('edit', {
          book: { id, title, author, genre, published_year, description, cover_image: existing_cover_image },
          title: 'Edit Book',
          genres: GENRES,
          error: 'Database error: ' + err.message
        });
      }
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
