const express = require('express');
const router = express.Router();
const { createItem, getAllItems ,deleteItem} = require('../controllers/inventorycontroller');

// Route to create a new item
router.post('/inventory', createItem);

// Route to get all items
router.get('/items', getAllItems);

router.delete('/inventory/:id', deleteItem);

module.exports = router;