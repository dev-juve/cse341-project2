const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(); // Will use the DB from URI
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDatabase, getDb };
