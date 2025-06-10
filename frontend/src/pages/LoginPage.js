import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import LoginImage from "../assets/login.png";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State for alert visibility

  // Email validation regex pattern
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages
    setLoading(true);
    setShowAlert(false); // Hide alert before new submission
  
    // Input validation
    if (!email || !password) {
      triggerAlert("Email and password are required.", "error");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(email)) {
      triggerAlert("Please enter a valid email.", "error");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
  
      const data = await response.json(); // Parse the JSON response
  
      // Ensure the response contains the user _id
      if (data.user && data.user._id) {
        // Store user email and _id in localStorage
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userId', data.user._id);
  
        // Trigger success message before navigation
        triggerAlert("Login successful!", "success");

        // Wait a moment before navigating to purchase page
        setTimeout(() => {
          navigate("/purchase");
        }, 2000); // 2 seconds delay before redirect
  
      } else {
        throw new Error("Invalid response from server");
      }
  
    } catch (error) {
      triggerAlert(error.message || "An unexpected error occurred. Please try again.", "error");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Function to trigger an alert with a message and type (error/success)
  const triggerAlert = (message, type) => {
    if (type === "error") {
      setErrorMessage(message);
      setSuccessMessage(""); // Clear any success messages
    } else if (type === "success") {
      setSuccessMessage(message);
      setErrorMessage(""); // Clear any error messages
    }

    setShowAlert(true); // Show the alert

    // Automatically hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      {/* Alert message */}
      {showAlert && (
        <div className={`alert ${successMessage ? 'success' : 'error'} show`} aria-live="assertive">
          {successMessage || errorMessage}
        </div>
      )}
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading} // Disable input while loading
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading} // Disable input while loading
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
        <div className="login-image-container">
          <img src={LoginImage} alt="Login Illustration" />
        </div>
      </div>
    </>
  );
};

export default Login;