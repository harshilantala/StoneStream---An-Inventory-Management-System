const Item = require('../models/inventorymodel');

// Create a new item
exports.createItem = async (req, res) => {
  const { name, description, amount, image } = req.body;

  // Log the request body to see what data is being received
 

  // Validate input fields
  if (!name || !description || !amount || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newItem = new Item({
      name,
      description,
      amount,
      image
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error creating item:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);  // Log error if fetching fails
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};


 // Assuming your Item model is defined

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id; // Get the item ID from the request params
    const deletedItem = await Item.findByIdAndDelete(itemId); // Delete item from DB

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
};