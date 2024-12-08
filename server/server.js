require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const userRoutes = require('./backend/routes/user');
const app = express();

// Telegram WebApp Validation Middleware
function validateTelegramWebApp(req, res, next) {
  const initData = req.body.initData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return res.status(500).json({ error: 'Telegram Bot Token not configured' });
  }

  try {
    // Telegram's validation logic
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return res.status(403).json({ error: 'Invalid Telegram WebApp data' });
    }

    next();
  } catch (error) {
    console.error('Telegram validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
}

// More specific CORS configuration
app.use(cors({
  origin: [
    'https://web.telegram.org',
    'https://t.me',
    'https://telegram.org',
    'https://coin-click-1.onrender.com/', // Add Telegram Mini App specific domain
    '*' // Temporary for testing, remove in production
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Existing middleware
app.use(express.json());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB connected'))
 .catch((err) => console.error('MongoDB connection error:', err));

// Routes with Telegram validation (optional - apply to specific routes)
app.use('/api/protected-user', validateTelegramWebApp, userRoutes);

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('<h1>Server is running successfully!</h1>');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});