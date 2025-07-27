const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');
const { updateItem } = require('../controllers/items');
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

// GET all items
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const items = await db.collection('items').find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST new item
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('inStock').isBoolean().withMessage('InStock must be a boolean'),
    body('tags').isArray().withMessage('Tags must be an array')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = getDb();
      const item = req.body;
      const result = await db.collection('items').insertOne(item);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create item' });
    }
  }
);

// PUT update item
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('inStock').isBoolean().withMessage('InStock must be a boolean'),
    body('tags').isArray().withMessage('Tags must be an array')
  ],
  updateItem
);

// DELETE item by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const db = getDb();
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
