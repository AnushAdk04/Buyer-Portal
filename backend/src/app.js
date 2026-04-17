const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Centralized error handler for upload and request validation errors.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max allowed size is 2MB for profile picture and 5MB for property image.' });
    }
    return res.status(400).json({ message: err.message || 'Upload failed due to invalid file.' });
  }

  if (err && err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    console.error('Unhandled API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }

  next();
});

module.exports = app;