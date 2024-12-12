const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Fetch user progress by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Return user progress
    res.json({ progress: user.progress, level: user.level, reward: user.reward, tapPower: user.tapPower });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save or update user progress by username
router.post('/:username', async (req, res) => {
  const { username } = req.params;
  const { progress, level, reward, tapPower } = req.body;

  // Basic validation to check if the required fields are present
  if (progress === undefined || level === undefined || reward === undefined || tapPower === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the username already exists
    let user = await User.findOne({ username });
    if (!user) {
      // Create a new user if one doesn't exist
      user = new User({ username, progress, level, reward, tapPower });
    } else {
      // Update existing user data
      user.progress = progress;
      user.level = level;
      user.reward = reward;
      user.tapPower = tapPower;
    }
    
    // Save the user
    await user.save();
    // Return success message and user data
    res.json({ message: "Progress saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
