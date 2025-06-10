import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/HomePage.css";
import InventoryIllustration from "../assets/inventory.png"; // Add your image file here
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const sentences = [
    "Streamline and organize all your inventory processes efficiently.",
    "Stay up-to-date with real-time inventory tracking and management.",
    "Minimize stockouts, overstocking, and improve your decision-making.",
    "Easily monitor sales, purchases, and stock levels with our system.",
  ];

  const [visibleText, setVisibleText] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const typingSpeed = 50; // Speed of typing in milliseconds

  // Typing effect
  useEffect(() => {
    if (typingIndex < sentences[currentSentenceIndex].length) {
      const timeout = setTimeout(() => {
        setVisibleText(
          (prev) => prev + sentences[currentSentenceIndex][typingIndex]
        );
        setTypingIndex(typingIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      // Delay before deleting the text
      setTimeout(() => {
        setVisibleText("");
        setTypingIndex(0);
        setCurrentSentenceIndex(
          (prevIndex) => (prevIndex + 1) % sentences.length
        );
      }, 2000); // Delay before switching to the next sentence
    }
  }, [typingIndex, currentSentenceIndex]);

  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <div className="homepage-overview">
          <h1>An Inventory Management Website</h1>
          <p className="typewriter-text">{visibleText}</p>
          <div className="btns">
            <button onClick={handleRegisterClick}>Register</button>
            <button onClick={handleLoginClick}>Login</button>
          </div>
        </div>
        <div className="homepage-illustration">
          <img src={InventoryIllustration} alt="Inventory Illustration" />
        </div>
      </div>
    </>
  );
};

export default HomePage;