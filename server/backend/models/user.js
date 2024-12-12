const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true, 
    minlength: 3,  // Optional: minimum length for username
    maxlength: 20, // Optional: maximum length for username
    index: true,   // Optional: explicitly index the username field
  },
  progress: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  reward: { type: Number, default: 0 },
  tapPower: { type: Number, default: 1 },
}, { timestamps: true }); // Optional: add createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
