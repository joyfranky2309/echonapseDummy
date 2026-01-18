const express = require('express');
const router = express.Router();
const User = require('../../schemas/userSchema');

// CREATE - Add a new user
router.post('/users', async (req, res) => {
  try {
    const { fullName, phno, email, condition, caretakerDetails } = req.body;

    // Validate required fields
    if (!fullName || !phno || !email || !condition) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phno }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or phone number already exists' });
    }

    const newUser = new User({
      fullName,
      phno,
      email,
      condition,
      caretakerDetails: caretakerDetails || [],
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// READ - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

// READ - Get a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});

// UPDATE - Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phno, email, condition, caretakerDetails } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (phno) user.phno = phno;
    if (email) user.email = email;
    if (condition) user.condition = condition;
    if (caretakerDetails) user.caretakerDetails = caretakerDetails;

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE - Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Add caretaker to existing user
router.post('/users/:id/caretaker', async (req, res) => {
  try {
    const { id } = req.params;
    const { caretakerName, phno, relation, emailID } = req.body;

    if (!caretakerName || !phno || !relation || !emailID) {
      return res.status(400).json({ message: 'All caretaker fields are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.caretakerDetails.push({ caretakerName, phno, relation, emailID });
    await user.save();

    res.status(200).json({ message: 'Caretaker added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error adding caretaker', error: error.message });
  }
});

// Delete caretaker from user
router.delete('/users/:userId/caretaker/:caretakerId', async (req, res) => {
  try {
    const { userId, caretakerId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.caretakerDetails = user.caretakerDetails.filter(
      (caretaker) => caretaker._id.toString() !== caretakerId
    );

    await user.save();
    res.status(200).json({ message: 'Caretaker deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting caretaker', error: error.message });
  }
});

module.exports = router;
