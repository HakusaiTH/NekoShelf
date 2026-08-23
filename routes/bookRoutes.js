// routes/bookRoutes.js
// Maps URL + HTTP method combinations to controller functions.

const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');

router.get('/', BookController.index);              // List all books
router.get('/books/add', BookController.showAddForm); // Show add form
router.post('/books', BookController.create);         // Create book

router.get('/books/:id/edit', BookController.showEditForm); // Show edit form
router.put('/books/:id', BookController.update);            // Update book
router.delete('/books/:id', BookController.destroy);        // Delete book

module.exports = router;
