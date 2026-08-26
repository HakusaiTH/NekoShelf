// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/', CategoryController.index);
router.get('/add', isAuthenticated, isAdmin, CategoryController.showAddForm);
router.post('/', isAuthenticated, isAdmin, CategoryController.create);
router.get('/:id/edit', isAuthenticated, isAdmin, CategoryController.showEditForm);
router.put('/:id', isAuthenticated, isAdmin, CategoryController.update);
router.delete('/:id', isAuthenticated, isAdmin, CategoryController.destroy);

module.exports = router;
