require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./backend/routes/user'); // Adjust if needed

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes);  // All user routes will be prefixed with /api/user

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('<h1>Server is running successfully!</h1>');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
