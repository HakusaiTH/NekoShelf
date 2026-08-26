// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/authorController');

router.get('/', AuthorController.index);
router.get('/add', AuthorController.showAddForm);
router.post('/', AuthorController.create);
router.get('/:id/edit', AuthorController.showEditForm);
router.put('/:id', AuthorController.update);
router.delete('/:id', AuthorController.destroy);

module.exports = router;
