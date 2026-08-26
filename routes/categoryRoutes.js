// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/', CategoryController.index);
router.get('/add', CategoryController.showAddForm);
router.post('/', CategoryController.create);
router.get('/:id/edit', CategoryController.showEditForm);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.destroy);

module.exports = router;
