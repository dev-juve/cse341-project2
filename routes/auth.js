const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { login, register } = require('../controllers/auth');
const authenticateJWT = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(CLIENT_ID);

// 🔒 Validation rules for login/register
const authValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// 🟢 POST /auth/register
router.post('/register', authValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await register(req, res);
});

// 🟢 POST /auth/login
router.post('/login', authValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await login(req, res);
});

// 🟢 POST /auth/google — handle token from frontend
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Optionally save user info to DB here

    const user = { id: sub, email, name, picture };
    const jwtToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// 🟣 Protected route example
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Welcome to protected route!', user: req.user });
});

// 🔴 Logout (frontend should delete token)
router.get('/logout', (req, res) => {
  res.json({ message: 'Logged out (client should delete the token)' });
});

module.exports = router;
