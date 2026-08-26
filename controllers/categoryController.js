// controllers/categoryController.js
// CONTROLLER: Manages Categories CRUD

const CategoryModel = require('../models/categoryModel');

const CategoryController = {
  // GET /categories
  index: (req, res) => {
    CategoryModel.getAll((err, categories) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('categories/index', {
        categories: categories || [],
        title: 'Categories & Genres',
        activeTab: 'categories'
      });
    });
  },

  // GET /categories/add
  showAddForm: (req, res) => {
    res.render('categories/add', {
      title: 'Add New Category',
      activeTab: 'categories',
      error: null,
      formData: {}
    });
  },

  // POST /categories
  create: (req, res) => {
    const { name, description } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).render('categories/add', {
        title: 'Add New Category',
        activeTab: 'categories',
        error: 'Category name is required.',
        formData: req.body || {}
      });
    }

    CategoryModel.create({ name: name.trim(), description: description ? description.trim() : null }, (err) => {
      if (err) {
        return res.status(500).render('categories/add', {
          title: 'Add New Category',
          activeTab: 'categories',
          error: err.message.includes('UNIQUE') ? 'Category name already exists.' : ('Database error: ' + err.message),
          formData: req.body || {}
        });
      }
      res.redirect('/categories');
    });
  },

  // GET /categories/:id/edit
  showEditForm: (req, res) => {
    const { id } = req.params;
    CategoryModel.getById(id, (err, category) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!category) return res.status(404).send('Category not found');
      res.render('categories/edit', {
        category,
        title: 'Edit Category',
        activeTab: 'categories',
        error: null
      });
    });
  },

  // PUT /categories/:id
  update: (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).render('categories/edit', {
        category: { id, name, description },
        title: 'Edit Category',
        activeTab: 'categories',
        error: 'Category name is required.'
      });
    }

    CategoryModel.update(id, { name: name.trim(), description: description ? description.trim() : null }, (err) => {
      if (err) {
        return res.status(500).render('categories/edit', {
          category: { id, name, description },
          title: 'Edit Category',
          activeTab: 'categories',
          error: 'Database error: ' + err.message
        });
      }
      res.redirect('/categories');
    });
  },

  // DELETE /categories/:id
  destroy: (req, res) => {
    const { id } = req.params;
    CategoryModel.delete(id, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/categories');
    });
  }
};

module.exports = CategoryController;
