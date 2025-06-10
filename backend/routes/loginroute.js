const express = require('express');
const { loginUser } = require('../controllers/logincontroller');
const router = express.Router();

// Login route
router.post('/login', loginUser);

module.exports = router;
