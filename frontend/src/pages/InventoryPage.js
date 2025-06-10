import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ItemCard from "../components/ItemCard.js";
import "../styles/InventoryPage.css";
import Navbar2 from "../components/Navbar2.js";

Modal.setAppElement('#root');

const InventoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    amount: "",
    image: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemData({ ...itemData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!itemData.name || !itemData.description || !itemData.amount || !itemData.image) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem]);
        setItemData({ name: "", description: "", amount: "", image: "" });
        closeModal();
      } else {
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding item.");
    }
  };

  // Delete function to be passed to ItemCard
  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${itemId}`, { // Corrected URL
        method: 'DELETE',
      });
  
      if (response.ok) {
        setItems(items.filter(item => item._id !== itemId)); // Remove deleted item from state
      } else {
        alert("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    }
  };
  
  return (
    <>
      <Navbar2 />
      <div className="inventory-page">
        <button className="plus-button" onClick={openModal}>
          +
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
        >
          <h2>Add New Item</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={itemData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Item Description"
            value={itemData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={itemData.amount}
            onChange={handleInputChange}
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} required/>
          <button onClick={handleSubmit}>Submit</button>
        </Modal>

        {/* Display the list of items */}
        <div className="item-cards">
          {items.length > 0 ? (
            items.map((item, index) => (
              <ItemCard key={index} item={item} onDelete={handleDelete} /> // Pass the delete function to ItemCard
            ))
          ) : (
            <p>No items available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;