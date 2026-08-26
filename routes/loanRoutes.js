// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/loanController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/', LoanController.index);
router.get('/add', isAuthenticated, isAdmin, LoanController.showCreateForm);
router.post('/', isAuthenticated, isAdmin, LoanController.create);
router.post('/:id/return', isAuthenticated, isAdmin, LoanController.returnBook);

module.exports = router;
