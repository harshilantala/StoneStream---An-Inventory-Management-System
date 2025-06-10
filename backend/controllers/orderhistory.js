const Purchase = require('../models/purchasemodel');
const Sale = require('../models/salesmodel');


exports.getPurchaseHistory = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching purchase history', error: err.message });
  }
};


exports.getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json({ success: true, sales });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching sales history', error: err.message });
  }
};
