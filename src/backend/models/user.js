const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  progress: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  reward: { type: Number, default: 0 },
  tapPower: { type: Number, default: 1 },
});

module.exports = mongoose.model('User', userSchema);
