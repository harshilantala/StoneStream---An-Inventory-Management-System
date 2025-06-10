const express = require('express');
const { getDashboardSummary, getItemSummary } = require('../controllers/dashboardcontroller'); // Adjust the path as necessary

const router = express.Router();

// Route to get the overall dashboard summary
router.get('/dashboard', getDashboardSummary);

// Route to get the summary for a specific item
router.get('/dashboard/:itemName', getItemSummary);

module.exports = router;
