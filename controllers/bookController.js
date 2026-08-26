// controllers/bookController.js
// CONTROLLER: Handles HTTP requests for Books with relational author and category linkage

const BookModel = require('../models/bookModel');
const AuthorModel = require('../models/authorModel');
const CategoryModel = require('../models/categoryModel');

const BookController = {
  // GET /books -> list all books with optional search & category filter
  index: (req, res) => {
    const { search, category_id } = req.query;

    CategoryModel.getAll((err, categories) => {
      BookModel.getAll(search, category_id, (err, books) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        res.render('books/index', {
          books: books || [],
          categories: categories || [],
          search: search || '',
          selectedCategory: category_id || '',
          title: 'Books Catalog',
          activeTab: 'books'
        });
      });
    });
  },

  // GET /books/add -> show "add book" form with author & category dropdowns
  showAddForm: (req, res) => {
    AuthorModel.getAll((err, authors) => {
      CategoryModel.getAll((err, categories) => {
        res.render('books/add', {
          title: 'Add a New Book',
          activeTab: 'books',
          authors: authors || [],
          categories: categories || [],
          error: null,
          formData: {}
        });
      });
    });
  },

  // POST /books -> create book
  create: (req, res) => {
    const { title, author_id, category_id, isbn, published_year, total_copies, description } = req.body || {};

    const renderWithForm = (errorMessage) => {
      AuthorModel.getAll((err, authors) => {
        CategoryModel.getAll((err, categories) => {
          res.status(400).render('books/add', {
            title: 'Add a New Book',
            activeTab: 'books',
            authors: authors || [],
            categories: categories || [],
            error: errorMessage,
            formData: req.body || {}
          });
        });
      });
    };

    if (req.uploadError) {
      return renderWithForm(req.uploadError);
    }

    if (!title || !title.trim()) {
      return renderWithForm('Book title is required.');
    }

    const cover_image = req.file ? '/uploads/' + req.file.filename : null;
    const copies = parseInt(total_copies) || 1;

    BookModel.create(
      {
        title: title.trim(),
        author_id: author_id || null,
        category_id: category_id || null,
        isbn: isbn ? isbn.trim() : null,
        published_year: published_year || null,
        total_copies: copies,
        available_copies: copies,
        cover_image,
        description: description ? description.trim() : null
      },
      (err) => {
        if (err) return renderWithForm('Database error: ' + err.message);
        res.redirect('/books');
      }
    );
  },

  // GET /books/:id/edit -> pre-filled edit form
  showEditForm: (req, res) => {
    const { id } = req.params;

    BookModel.getById(id, (err, book) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!book) return res.status(404).send('Book not found');

      AuthorModel.getAll((err, authors) => {
        CategoryModel.getAll((err, categories) => {
          res.render('books/edit', {
            book,
            title: 'Edit Book',
            activeTab: 'books',
            authors: authors || [],
            categories: categories || [],
            error: null
          });
        });
      });
    });
  },

  // GET /books/:id/json -> API endpoint for modal
  getDetailJson: (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    });
  },

  // PUT /books/:id -> update book
  update: (req, res) => {
    const { id } = req.params;
    const { title, author_id, category_id, isbn, published_year, total_copies, available_copies, description, existing_cover_image } = req.body || {};

    const renderWithForm = (errorMessage) => {
      AuthorModel.getAll((err, authors) => {
        CategoryModel.getAll((err, categories) => {
          res.status(400).render('books/edit', {
            book: {
              id,
              title,
              author_id,
              category_id,
              isbn,
              published_year,
              total_copies,
              available_copies,
              description,
              cover_image: existing_cover_image
            },
            title: 'Edit Book',
            activeTab: 'books',
            authors: authors || [],
            categories: categories || [],
            error: errorMessage
          });
        });
      });
    };

    if (req.uploadError) {
      return renderWithForm(req.uploadError);
    }

    if (!title || !title.trim()) {
      return renderWithForm('Book title is required.');
    }

    let cover_image;
    if (req.file) {
      cover_image = '/uploads/' + req.file.filename;
    } else if (existing_cover_image !== undefined) {
      cover_image = existing_cover_image;
    }

    BookModel.update(
      id,
      {
        title: title.trim(),
        author_id: author_id || null,
        category_id: category_id || null,
        isbn: isbn ? isbn.trim() : null,
        published_year: published_year || null,
        total_copies: parseInt(total_copies) || 1,
        available_copies: parseInt(available_copies) || 1,
        cover_image,
        description: description ? description.trim() : null
      },
      (err) => {
        if (err) return renderWithForm('Database error: ' + err.message);
        res.redirect('/books');
      }
    );
  },

  // DELETE /books/:id -> remove book
  destroy: (req, res) => {
    const { id } = req.params;
    BookModel.delete(id, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/books');
    });
  }
};

module.exports = BookController;
