import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PurchasePage from './pages/PurchasePage';
import SalePage from './pages/SalePage';
import InventoryPage from './pages/InventoryPage'; 
import LoginPage from './pages/LoginPage';
import ProfileSettings from './components/ProfileSettings';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import Invoice from './pages/Invoice';
import Dashboard from './pages/DashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/inventory" element={<InventoryPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/profile-setting" element={<ProfileSettings />} /> 
        <Route path="/order-history" element={<OrderHistory />} /> 
        <Route path="/invoice" element={<Invoice />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
