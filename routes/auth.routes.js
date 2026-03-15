const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controllers');
const { protect } = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;