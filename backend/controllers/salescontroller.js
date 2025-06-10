const Sale = require('../models/salesmodel'); // Import your Sale model
const Vendor = require('../models/purchasemodel'); // Import your Vendor model

exports.addSale = async (req, res) => {
  try {
    const { customerName, customerEmail, customerMobile, paymentMethod, itemName, quantity, amount, dateOfSale } = req.body;

    // Ensure all required fields are provided
    if (!customerName || !customerEmail || !itemName || !quantity || !amount || !customerMobile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate the quantity, amount, and date
    const parsedQuantity = parseInt(quantity, 10);
    const parsedAmount = parseFloat(amount);
    const parsedDate = dateOfSale ? new Date(dateOfSale) : new Date();

    if (isNaN(parsedQuantity) || isNaN(parsedAmount) || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid data format for quantity, amount, or date' });
    }

    // Find vendor records for the item being sold
    let remainingQuantity = parsedQuantity;
    const vendors = await Vendor.find({ itemName, remainingQuantity: { $gt: 0 } }).sort({ dateOfPurchase: 1 });

    // Check if there's sufficient quantity available in total
    const totalAvailableQuantity = vendors.reduce((acc, vendor) => acc + vendor.remainingQuantity, 0);
    if (totalAvailableQuantity < remainingQuantity) {
      return res.status(400).json({ message: 'Insufficient quantity available in vendor stock' });
    }

    // Subtract quantity from vendor records
    for (const vendor of vendors) {
      if (remainingQuantity <= 0) break; // If remaining quantity is zero, stop updating

      if (vendor.remainingQuantity >= remainingQuantity) {
        vendor.remainingQuantity -= remainingQuantity;
        remainingQuantity = 0; // All quantity has been accounted for
      } else {
        remainingQuantity -= vendor.remainingQuantity;
        vendor.remainingQuantity = 0; // Vendor's stock depleted
      }

      // Save updated vendor record
      await vendor.save();
    }

    // Create and save the sale data in the Sale collection
    const sale = new Sale({
      customerName,
      customerEmail,
      customerMobile,
      paymentMethod,
      itemName,
      quantity: parsedQuantity, // Ensure this matches your Sale model
      amount: parsedAmount,
      date: parsedDate // Use 'date' to match your Sale model
    });

    // Save the sale data
    await sale.save();

    res.status(201).json({ message: 'Sale data stored successfully and stock updated' });

  } catch (error) {
    console.error('Error adding sale data:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
};
