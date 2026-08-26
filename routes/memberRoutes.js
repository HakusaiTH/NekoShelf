// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/', MemberController.index);
router.get('/add', isAuthenticated, isAdmin, MemberController.showAddForm);
router.post('/', isAuthenticated, isAdmin, MemberController.create);
router.get('/:id/edit', isAuthenticated, isAdmin, MemberController.showEditForm);
router.put('/:id', isAuthenticated, isAdmin, MemberController.update);
router.delete('/:id', isAuthenticated, isAdmin, MemberController.destroy);

module.exports = router;
