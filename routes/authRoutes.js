// routes/authRoutes.js
// Express Router for User Authentication (Login, Register, Logout)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.processLogin);

router.get('/register', authController.showRegister);
router.post('/register', authController.processRegister);

router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
