// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');

router.get('/', MemberController.index);
router.get('/add', MemberController.showAddForm);
router.post('/', MemberController.create);
router.get('/:id/edit', MemberController.showEditForm);
router.put('/:id', MemberController.update);
router.delete('/:id', MemberController.destroy);

module.exports = router;
