const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

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
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const item = req.body;
    const result = await db.collection('items').insertOne(item);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

module.exports = router;
