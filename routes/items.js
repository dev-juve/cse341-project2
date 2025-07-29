const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticateJWT = require('../middleware/authMiddleware');

const {
  getItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/items');

// 🔒 Validation rules reused in POST and PUT
const itemValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('inStock').isBoolean().withMessage('InStock must be a boolean'),
  body('tags').isArray().withMessage('Tags must be an array')
];

// 🟢 GET all items
router.get('/', authenticateJWT, getItems);

// 🟢 POST create item
router.post('/', authenticateJWT, itemValidationRules, createItem);

// 🟡 PUT update item
router.put('/:id', authenticateJWT, itemValidationRules, updateItem);

// 🔴 DELETE item
router.delete('/:id', authenticateJWT, deleteItem);

module.exports = router;
