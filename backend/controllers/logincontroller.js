const User = require('../models/register');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ email }, 'secure', { expiresIn: '1h' });

    // Store the token in a cookie with proper options
    res.cookie('token', token, {
      expires: new Date(Date.now()+360000),
      httpOnly: true,
    });

    // Log the token and cookie for debugging
    

    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, _id: user._id }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { loginUser };