const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Fetch user progress by Telegram ID
router.get('/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save or update user progress
router.post('/:telegramId', async (req, res) => {
  const { progress, level, reward, tapPower } = req.body;
  try {
    let user = await User.findOne({ telegramId: req.params.telegramId });
    if (user) {
      user.progress = progress;
      user.level = level;
      user.reward = reward;
      user.tapPower = tapPower;
      await user.save();
      res.json(user);
    } else {
      user = new User({
        telegramId: req.params.telegramId,
        progress,
        level,
        reward,
        tapPower
      });
      await user.save();
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
