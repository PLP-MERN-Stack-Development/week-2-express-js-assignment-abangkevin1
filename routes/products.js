const express = require('express');
const router = express.Router();
const Product = require('../products');

// Middleware to validate product data
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Invalid product data.' });
  }
  next();
}

// GET /api/products?category=electronics&page=1&limit=10&search=phone
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = new Product({ name, description, price, category, inStock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, inStock },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Product statistics by category
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;