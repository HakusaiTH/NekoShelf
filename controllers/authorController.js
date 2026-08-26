// controllers/authorController.js
// CONTROLLER: Manages Authors CRUD and viewing books by Author

const AuthorModel = require('../models/authorModel');

const AuthorController = {
  // GET /authors -> list all authors
  index: (req, res) => {
    AuthorModel.getAll((err, authors) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('authors/index', {
        authors: authors || [],
        title: 'Authors Management',
        activeTab: 'authors'
      });
    });
  },

  // GET /authors/add -> form
  showAddForm: (req, res) => {
    res.render('authors/add', {
      title: 'Add New Author',
      activeTab: 'authors',
      error: null,
      formData: {}
    });
  },

  // POST /authors -> create
  create: (req, res) => {
    const { name, bio } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).render('authors/add', {
        title: 'Add New Author',
        activeTab: 'authors',
        error: 'Author name is required.',
        formData: req.body || {}
      });
    }

    AuthorModel.create({ name: name.trim(), bio: bio ? bio.trim() : null }, (err) => {
      if (err) {
        return res.status(500).render('authors/add', {
          title: 'Add New Author',
          activeTab: 'authors',
          error: 'Database error: ' + err.message,
          formData: req.body || {}
        });
      }
      res.redirect('/authors');
    });
  },

  // GET /authors/:id/edit -> form
  showEditForm: (req, res) => {
    const { id } = req.params;
    AuthorModel.getById(id, (err, author) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!author) return res.status(404).send('Author not found');
      res.render('authors/edit', {
        author,
        title: 'Edit Author',
        activeTab: 'authors',
        error: null
      });
    });
  },

  // PUT /authors/:id -> update
  update: (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).render('authors/edit', {
        author: { id, name, bio },
        title: 'Edit Author',
        activeTab: 'authors',
        error: 'Author name is required.'
      });
    }

    AuthorModel.update(id, { name: name.trim(), bio: bio ? bio.trim() : null }, (err) => {
      if (err) {
        return res.status(500).render('authors/edit', {
          author: { id, name, bio },
          title: 'Edit Author',
          activeTab: 'authors',
          error: 'Database error: ' + err.message
        });
      }
      res.redirect('/authors');
    });
  },

  // DELETE /authors/:id
  destroy: (req, res) => {
    const { id } = req.params;
    AuthorModel.delete(id, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/authors');
    });
  }
};

module.exports = AuthorController;
