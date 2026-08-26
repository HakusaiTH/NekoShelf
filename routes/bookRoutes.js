// routes/bookRoutes.js
// Maps URL + HTTP method combinations to BookController functions with RBAC middleware.

const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const upload = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/', BookController.index);                                             // List books catalog (Public/User)
router.get('/:id/json', BookController.getDetailJson);                             // Get book detail JSON (Public/User)

router.get('/add', isAuthenticated, isAdmin, BookController.showAddForm);          // Show add book form (Admin)
router.post('/', isAuthenticated, isAdmin, upload, BookController.create);         // Create book (Admin)
router.get('/:id/edit', isAuthenticated, isAdmin, BookController.showEditForm);    // Show edit book form (Admin)
router.put('/:id', isAuthenticated, isAdmin, upload, BookController.update);      // Update book (Admin)
router.delete('/:id', isAuthenticated, isAdmin, BookController.destroy);          // Delete book (Admin)

module.exports = router;
