// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/authorController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/', AuthorController.index);
router.get('/add', isAuthenticated, isAdmin, AuthorController.showAddForm);
router.post('/', isAuthenticated, isAdmin, AuthorController.create);
router.get('/:id/edit', isAuthenticated, isAdmin, AuthorController.showEditForm);
router.put('/:id', isAuthenticated, isAdmin, AuthorController.update);
router.delete('/:id', isAuthenticated, isAdmin, AuthorController.destroy);

module.exports = router;
