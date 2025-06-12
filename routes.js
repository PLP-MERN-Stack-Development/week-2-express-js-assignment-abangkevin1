const products = require('./products'); // Importing products from the products.js file
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Product = require('./products'); // Importing the Product model
const router = express.Router();

// Apply the API key middleware to all routes
router.use(apiKeyMiddleware);

//post products
router.post('/api/products', async (req, res) => {
  try {
    const products = new Product(req);
    await products.save();
    res.status(201).json(products);
    
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

