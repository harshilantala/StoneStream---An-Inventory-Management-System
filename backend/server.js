const express = require('express');
const connectDB = require('./database/db'); 
const userRoutes = require('./routes/registerroute'); 
const loginRoutes = require('./routes/loginroute'); 
const purchaseRoute = require('./routes/purchaseroute');  
const salesRoute = require('./routes/salesrouter'); 
const inventoryRoute = require('./routes/inventoryroute'); 
const orderHistoryRoute = require('./routes/orderhistoryroute'); 
const profileRoute = require('./routes/profileroute'); 
const dashboardroutes = require('./routes/dashboardroute'); 
const path = require('path');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(express.json()); 
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


app.use('/api', userRoutes); 
app.use('/api', loginRoutes); 
app.use('/api', purchaseRoute); 
app.use('/api', salesRoute); 
app.use('/api', inventoryRoute); 
app.use('/api/orders', orderHistoryRoute); 
app.use('/api', profileRoute); 
app.use('/api', dashboardroutes); 


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
