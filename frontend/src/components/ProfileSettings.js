import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileSettings.css";
import { FaTrashAlt } from "react-icons/fa";
import Navbar2 from "../components/Navbar2.js";

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    image: null,
    imageUrl: "",
  });
  const [removeImage, setRemoveImage] = useState(false); // To track image removal
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.mobileNo,
          shopName: data.user.shopName,
          imageUrl: data.user.imageUrl || "", // Load existing image URL
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setRemoveImage(false); // Reset remove flag if a new image is selected
  };

  const handleRemoveImage = () => {
    setUserData((prevData) => ({
      ...prevData,
      image: null, // Clear the selected image
      imageUrl: "", // Clear the image URL from the profile
    }));
    setRemoveImage(true); // Set the flag to true to indicate removal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('mobileNo', userData.phone);
    formData.append('shopName', userData.shopName);
    if (userData.image) {
      formData.append('image', userData.image); // Add the new image if it exists
    } else if (removeImage) {
      formData.append('removeImage', true); // Indicate image removal if flagged
    }

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedUser = await response.json();
      setUserData((prevData) => ({
        ...prevData,
        imageUrl: updatedUser.user.imageUrl, // Update the image URL
      }));

      console.log("User data updated:", updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="profile-settings-wrapper">
        <div className="profile-settings-container">
          <h2>Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-image-section">
              <div className="image-wrapper">
                <img
                  src={
                    userData.image
                      ? URL.createObjectURL(userData.image)
                      : userData.imageUrl
                      ? `http://localhost:5000${userData.imageUrl}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="profile-img"
                />
                {userData.imageUrl && (
                  <FaTrashAlt
                    className="remove-icon"
                    onClick={handleRemoveImage}
                  />
                )}
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Shop Name:</label>
              <input
                type="text"
                name="shopName"
                value={userData.shopName}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;