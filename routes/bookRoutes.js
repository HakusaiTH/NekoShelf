// routes/bookRoutes.js
// Maps URL + HTTP method combinations to controller functions.

const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const upload = require('../middleware/upload');

router.get('/', BookController.index);                        // List all books
router.get('/books/add', BookController.showAddForm);          // Show add form
router.post('/books', upload, BookController.create);          // Create book with cover upload

router.get('/books/:id/json', BookController.getDetailJson);  // Get book details as JSON
router.get('/books/:id/edit', BookController.showEditForm);   // Show edit form
router.put('/books/:id', upload, BookController.update);       // Update book with cover upload
router.delete('/books/:id', BookController.destroy);          // Delete book

module.exports = router;
