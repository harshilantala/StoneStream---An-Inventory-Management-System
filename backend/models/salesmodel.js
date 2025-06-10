const mongoose = require('mongoose');
const { isEmail } = require('validator');

const salesSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Please enter an email'],
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    index: true // Adding an index for faster querying by email if needed
  },
  customerMobile: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Example regex for a 10-digit number
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online'],
    default: 'Cash'
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    index: true // Keeping the index on itemName for optimized queries
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity cannot be less than 1']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount cannot be less than 1']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
