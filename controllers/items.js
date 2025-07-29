const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const { validationResult } = require('express-validator');

// GET all items
async function getItems(req, res) {
  try {
    const db = getDb();
    const items = await db.collection('items').find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}

// POST new item
async function createItem(req, res) {
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

// PUT update item
async function updateItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const data = req.body;

  try {
    const db = getDb();
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ error: 'Item not found or not updated' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error during update' });
  }
}

// DELETE item
async function deleteItem(req, res) {
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
}

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
