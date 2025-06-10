const express = require('express');
const connectDB = require('./database/db'); // Database connection
const userRoutes = require('./routes/registerroute'); // Registration routes
const loginRoutes = require('./routes/loginroute'); // Login routes
const purchaseRoute = require('./routes/purchaseroute'); // Purchase routes
const salesRoute = require('./routes/salesrouter'); // Sales routes
const inventoryRoute = require('./routes/inventoryroute'); 
const orderHistoryRoute = require('./routes/orderhistoryroute'); 
const profileRoute = require('./routes/profileroute'); 
const dashboardroutes = require('./routes/dashboardroute'); 
const path = require('path');
const cors = require('cors'); // CORS middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Built-in body parser for JSON
app.use(cors()); // Enable CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads'

// Routes
app.use('/api', userRoutes); // Registration route
app.use('/api', loginRoutes); // Login route
app.use('/api', purchaseRoute); // Purchase routes
app.use('/api', salesRoute); // Sales routes
app.use('/api', inventoryRoute); // Inventory routes
app.use('/api/orders', orderHistoryRoute); // Order history routes
app.use('/api', profileRoute); // Profile update route
app.use('/api', dashboardroutes); // Dashboard routes

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
