// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');
const productsRoutes = require('./routes/products');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
const mongoUri = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/your_database_name';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use(authMiddleware);

// Root route
app.get('/', (req, res) => {
  res.send('Hello world.');
});

// Product routes
app.use('/api/products', productsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;