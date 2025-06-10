const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/register'); // Assuming you have a User model

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

router.put('/profile/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNo, shopName, removeImage } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.mobileNo = mobileNo;
    user.shopName = shopName;

    // Handle image upload
    if (req.file) {
      // If a new image is uploaded, delete the old image file
      if (user.imageUrl) {
        const oldImagePath = path.join(__dirname, '../', user.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      // Set the new image URL
      user.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Handle image removal
    if (removeImage === 'true') {
      // Delete the old image file
      if (user.imageUrl) {
        const oldImagePath = path.join(__dirname, '../', user.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      // Clear the imageUrl field in the database
      user.imageUrl = null;
    }

    // Save the updated user
    await user.save();

    res.json({ user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;