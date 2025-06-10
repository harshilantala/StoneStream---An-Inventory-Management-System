const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderhistory');

// Route for fetching purchase history
router.get('/purchase-history', orderHistoryController.getPurchaseHistory);

// Route for fetching sales history
router.get('/sales-history', orderHistoryController.getSalesHistory);

module.exports = router;
