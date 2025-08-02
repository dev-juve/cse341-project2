const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');
const { body, validationResult } = require('express-validator');
const authenticateJWT = require('../middleware/authMiddleware');

// GET all users
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT update user
router.put('/:id', authenticateJWT, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const db = getDb();
    const updateData = { email: req.body.email };
    if (req.body.password) {
      updateData.password = req.body.password; // For now, we’ll skip hashing for demo purposes
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found or not updated' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// DELETE user
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
