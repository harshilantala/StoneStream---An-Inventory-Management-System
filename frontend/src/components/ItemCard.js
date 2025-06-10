import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Importing a trash icon from react-icons

const ItemCard = ({ item, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="item-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }} // Ensure the card has relative positioning for the icon
    >
      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
      {isHovered && (
        <>
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Amount: {item.amount}</p>
          </div>

          {/* Delete icon positioned at the bottom right */}
          <FaTrashAlt
            className="delete-icon"
            onClick={() => onDelete(item._id)} // Pass the item's id to the onDelete function
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              cursor: 'pointer',
              color: 'red',
            }}
          />
        </>
      )}
    </div>
  );
};

export default ItemCard;