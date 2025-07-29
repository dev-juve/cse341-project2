const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/connection');

const SECRET = process.env.JWT_SECRET;

// User login
async function login(req, res) {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
}

// User registration
async function register(req, res) {
  const { email, password } = req.body;
  const db = getDb();
  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({ email, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
}

module.exports = { login, register };
