// routes/bookRoutes.js
// Maps URL + HTTP method combinations to BookController functions.

const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const upload = require('../middleware/upload');

router.get('/', BookController.index);                       // List books catalog
router.get('/add', BookController.showAddForm);               // Show add book form
router.post('/', upload, BookController.create);              // Create book
router.get('/:id/json', BookController.getDetailJson);       // Get book JSON detail for modal
router.get('/:id/edit', BookController.showEditForm);        // Show edit book form
router.put('/:id', upload, BookController.update);            // Update book
router.delete('/:id', BookController.destroy);               // Delete book

module.exports = router;
