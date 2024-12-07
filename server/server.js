require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./backend/routes/user');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI; // Corrected this to use the environment variable

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes);

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('<h1>Server is running successfully on Vercel!</h1>');
});

// Export the app as a Vercel serverless function
module.exports = app;
