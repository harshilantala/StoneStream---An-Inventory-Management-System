  const express = require('express');
  const User = require('../models/register'); // User model
  const multer = require('multer');
  const path = require('path');

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory for uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
    },
  });

  const upload = multer({ storage });

  // Register User
  const registerUser = async (req, res) => {
    const { name, email, password, mobileNo, shopName, address } = req.body;
    let imageUrl = ''; // Initialize imageUrl

    if (!name || !email || !password || !mobileNo || !shopName || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Check if an image was uploaded
      if (req.file) {
        imageUrl = req.file.path; // Set imageUrl to the path of the uploaded image
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        password, // Store hashed password
        mobileNo,
        shopName,
        address,
        imageUrl, // Include imageUrl in the new user object
      });

      await newUser.save();

      res.status(201).json({
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  // Get user details
  const getUserDetails = async (req, res) => {
    const { userId } = req.params; // Get userId from the URL parameters

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const user = await User.findById(userId).select('-password'); // Exclude password

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user }); // Return user details
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
    registerUser,
    getUserDetails, // Export the new method
    upload, // Export the upload middleware
  };