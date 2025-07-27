const { validationResult } = require('express-validator');
const { updateResource } = require('../models/items');

async function updateItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const data = req.body;

  try {
    const result = await updateResource(id, data);
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item updated successfully' });
    } else {
      res.status(404).json({ error: 'Item not found or not updated' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error during update' });
  }
}

module.exports = {
  updateItem
};
