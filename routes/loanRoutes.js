// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/loanController');

router.get('/', LoanController.index);
router.get('/add', LoanController.showCreateForm);
router.post('/', LoanController.create);
router.post('/:id/return', LoanController.returnBook);

module.exports = router;
