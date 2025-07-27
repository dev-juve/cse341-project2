const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

async function updateResource(id, data) {
  const db = getDb();
  return await db
    .collection('items')
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}

module.exports = {
  updateResource
};
