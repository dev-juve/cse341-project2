const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { connectToDatabase } = require('./db/connection');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const userRoutes = require('./routes/users');


require('dotenv').config();

const PORT = process.env.PORT || 8080;

// === Middleware ===
app.use(cors());
app.use(express.json());


// Session middleware (must come before passport)
app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', userRoutes);

// === Google OAuth Strategy ===
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      // You could store user info in DB here
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// === Routes ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('👋 Welcome to the Project 2 API with OAuth!');
});

// OAuth entry point
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('❌ Authentication failed.');
});

app.get('/auth/success', (req, res) => {
  res.send(`✅ Welcome, ${req.user.displayName}`);
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Items route
const itemRoutes = require('./routes/items');
app.use('/items', itemRoutes);


// === Start Server ===
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
