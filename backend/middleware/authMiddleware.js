const jwt = require('jsonwebtoken');

// Middleware to verify if the user is authenticated
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, 'SecurityKey'); // Use your secret key
    req.user = verified; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
