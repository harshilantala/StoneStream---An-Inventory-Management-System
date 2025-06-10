// models/purchaseModel.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true
    },
    vendorEmail: {
        type: String,
        required: true
    },
    vendorMobile: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Example regex for a 10-digit number
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    purchaseQuantity: { // Original purchase quantity
        type: Number,
        required: true
    },
    remainingQuantity: { // Quantity available after sales
        type: Number,
        required: true
    },
    amount: {
        type: Number, // Changed to Number for calculations
        required: true
    },
    dateOfPurchase: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
