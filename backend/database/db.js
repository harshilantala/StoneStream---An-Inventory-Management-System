const mongoose = require('mongoose');

const uri = 'mongodb+srv://nand_05:Nand%402005@inventory.p7kgevl.mongodb.net/?authSource=WEB_STONESTREAM&authMechanism=SCRAM-SHA-1'; // Replace with your MongoDB connection string

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
