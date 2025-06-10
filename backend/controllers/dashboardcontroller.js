const Item = require('../models/inventorymodel'); // Assuming you have an item model
const Purchase = require('../models/purchasemodel'); // Assuming you have a purchase model
const Sale = require('../models/salesmodel'); // Assuming you have a sale model

// Controller for fetching overall dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        // Fetch total count of items in the inventory
        const totalItems = await Item.countDocuments(); // Counts total items in the Item collection
        
        // Aggregate total purchases
        const totalPurchase = await Purchase.aggregate([
            { $group: { _id: null, total: { $sum: "$purchaseQuantity" } } } // Sum up all purchase quantities
        ]);

        // Aggregate total sales
        const totalSales = await Sale.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } } // Sum up all sales quantities
        ]);

        res.json({
            totalItems,
            totalPurchase: totalPurchase[0]?.total || 0, // Default to 0 if no purchases
            totalSales: totalSales[0]?.total || 0, // Default to 0 if no sales
            items: await Item.find() // Fetching items to show in dropdown
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Error fetching dashboard summary', error });
    }
};

// Controller for fetching item-specific summary
exports.getItemSummary = async (req, res) => {
    const { itemName } = req.params; // Extract item name from the URL
    try {
        // Check if itemName is valid and not empty
        if (!itemName) {
            return res.status(400).json({ message: 'Item name is required.' });
        }

        // Fetch total purchase quantity for the specific item
        const totalPurchase = await Purchase.aggregate([
            { $match: { itemName } }, // Match the item name
            { $group: { _id: null, total: { $sum: "$purchaseQuantity" } } } // Sum purchase quantities
        ]);

        // Fetch total sales quantity for the specific item
        const totalSales = await Sale.aggregate([
            { $match: { itemName } }, // Match the item name
            { $group: { _id: null, total: { $sum: "$quantity" } } } // Sum sales quantities
        ]);

        // Debugging: log the total purchase and sales
        console.log('Total Purchase:', totalPurchase);
        console.log('Total Sales:', totalSales);

        res.json({
            totalPurchase: totalPurchase[0]?.total || 0, // Default to 0 if no purchases
            totalSales: totalSales[0]?.total || 0 // Default to 0 if no sales
        });
    } catch (error) {
        console.error(`Error fetching summary for ${itemName}:`, error);
        res.status(500).json({ message: `Error fetching summary for ${itemName}`, error });
    }
};
