const mongoose = require('mongoose');
const express = require('express');


// Define the product schema
const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true }
});

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
