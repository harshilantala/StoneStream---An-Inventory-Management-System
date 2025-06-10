
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWarehouse, FaShoppingCart, FaDollarSign, FaChartLine, FaHistory, FaFileInvoice, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../styles/Navbar2.css'; // Ensure your CSS styles are updated accordingly

const Navbar2 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState(''); // To store the username from the database
    const [userImage, setUserImage] = useState(''); // To store the user image URL
    const navigate = useNavigate();

    // Toggle for menu icon in mobile view
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Fetch user data from the database
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserName(data.user.name); // Set username from the database
                setUserImage(data.user.image); // Set user image from the database
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Navigate to profile settings when username is clicked
    const handleProfileClick = () => {
        navigate('/profile-setting');
    };

    // Handle click on Dashboard to navigate
    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    return (
        <nav className={`navbar2 ${isOpen ? 'open' : ''}`}>
            <div className="brand-logo">StoneStream</div>
            <div className="menu-icon" onClick={toggleMenu}>
                &#9776; {/* Menu icon */}
            </div>
            <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                <li><Link to="/inventory"><FaWarehouse /> Inventory</Link></li>
                <li><Link to="/purchase"><FaShoppingCart /> Purchase</Link></li>
                <li><Link to="/sale"><FaDollarSign /> Sale</Link></li>
                {/* Replaced Link with onClick for Dashboard */}
                <li onClick={handleDashboardClick} style={{ cursor: 'pointer' }}><FaChartLine /> Dashboard</li>
                <li><Link to="/order-history"><FaHistory /> Order History</Link></li>
                <li><Link to="/invoice"><FaFileInvoice /> Invoice</Link></li>
                <li><Link to="/"><FaSignOutAlt /> Logout</Link></li>
            </ul>
            <div className="profile-section">
                {/* Display user image or default icon */}
                {userImage ? (
                    <img src={userImage} alt="User" className="user-image" />
                ) : (
                    <FaUserCircle className="profile-icon" />
                )}
                <div className="profile-details" onClick={handleProfileClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <h4 style={{ marginLeft: '8px', margin: '0' }}>{userName}</h4> {/* Username from the database */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar2;
