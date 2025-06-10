const nodemailer = require('nodemailer');
const Purchase = require('../models/purchasemodel'); // Purchase model
const User = require('../models/register'); // User model

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your email provider
    auth: {
        user: 'harshil5858@gmail.com', // Replace with your email
        pass: 'mvdi ybpn swvv owkw'  // Replace with your email password or app password
    }
});

// Function to check for low stock and send emails
const checkLowStockAndSendEmails = async () => {
    try {
        // Fetch all purchases with remainingQuantity less than 20
        const lowStockPurchases = await Purchase.find({ remainingQuantity: { $lt: 20 } });

        // If no low-stock items, exit the function
        if (lowStockPurchases.length === 0) {
            console.log('No low-stock items found');
            return;
        }

        // Send an email for each low-stock purchase
        for (const purchase of lowStockPurchases) {
            // Fetch the user associated with the purchase
            const user = await User.findById(purchase.user_id);

            if (user) {
                const mailOptions = {
                    from: 'harshil5858@gmail.com', // Sender address
                    to: 'banugariyanand@gmail.com', // User's email 
                    subject: `Low Stock Alert for ${purchase.itemName}`,
                    text: `Dear ${user.name},\n\nThe item "${purchase.itemName}" has a remaining quantity of ${purchase.remainingQuantity}, which is below the threshold of 20.\nPlease restock soon to avoid running out.\n\nBest regards,\nYour Inventory Management System`
                };

                // Send the email
                await transporter.sendMail(mailOptions);
                console.log(`Low-stock email sent to ${user.email} for item ${purchase.itemName}`);
            } else {
              
            }
        }
    } catch (error) {
        console.error('Error checking low stock or sending emails:', error);
    }
};

// Run low stock check when the server starts
checkLowStockAndSendEmails();

// Add a new purchase
exports.addPurchase = async (req, res) => {
    try {
        // Extract userId from the request body (coming from the frontend)
        const userId = req.body.userId;

        // Destructure the purchase details from the request body 
        const { vendorName, vendorEmail, vendorMobile, paymentMethod, itemName, purchaseQuantity, amount, dateOfPurchase } = req.body;

        // Basic validation
        if (!vendorName || !vendorEmail || !vendorMobile || !paymentMethod || !itemName || !purchaseQuantity || !amount || !dateOfPurchase) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate vendorEmail format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(vendorEmail)) {
            return res.status(400).json({ message: 'Invalid vendor email format' });
        }

        // Validate vendorMobile format (assumes 10-digit number)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(vendorMobile)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        // Validate dateOfPurchase
        const purchaseDate = new Date(dateOfPurchase);
        if (isNaN(purchaseDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for dateOfPurchase' });
        }

        // Calculate remaining quantity as initially equal to purchase quantity
        const remainingQuantity = purchaseQuantity;

        // Create a new Purchase document
        const newPurchase = new Purchase({
            user_id: userId, // Link the purchase to the logged-in user
            vendorName,
            vendorEmail,
            vendorMobile,
            paymentMethod,
            itemName,
            purchaseQuantity,
            remainingQuantity, // Set remainingQuantity to purchaseQuantity initially
            amount,
            dateOfPurchase
        });

        // Save the document to the database
        await newPurchase.save();

        // Send a success response
        res.status(201).json({ message: 'Purchase added successfully', purchase: newPurchase });
    } catch (error) {
        console.error('Error adding purchase:', error); // Log the error for debugging
        // Send an error response
        res.status(500).json({ message: 'Error adding purchase', error: error.message });
    }
};
