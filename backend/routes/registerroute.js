const express = require('express');
const { registerUser, getUserDetails, upload } = require('../controllers/registercontroller'); // Import the upload middleware
const router = express.Router();

// Registration route with image upload
router.post('/register', upload.single('image'), registerUser); // Use multer middleware for image upload

// Profile route to get user details by userId
router.get('/profile/:userId', getUserDetails);

module.exports = router;