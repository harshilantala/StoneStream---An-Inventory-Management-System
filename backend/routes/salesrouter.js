const express = require('express');
const router = express.Router();
const saleController = require('../controllers/salescontroller'); // Adjust path as needed

router.post('/sales', saleController.addSale);

module.exports = router;
