const express = require('express');
const router = express.Router();
const { addPurchase } = require('../controllers/purchasecontroller'); // Ensure this path is correct

// POST route for creating a new purchase
router.post('/purchases', addPurchase);

module.exports = router;
