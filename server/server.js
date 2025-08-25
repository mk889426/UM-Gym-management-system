// src/index.js
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const connectDB    = require('./src/config/db');
const authRoutes   = require('./src/routes/authRoutes');
const adminRoutes  = require('./src/routes/adminRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const userRoutes   = require('./src/routes/userRoutes');

const app = express();

// Connect to Mongo
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth',   authRoutes);
app.use('/admin',  adminRoutes);
app.use('/member', memberRoutes);
app.use('/user',   userRoutes);

// Health-check
app.get('/', (_req, res) => res.send('🏋️‍♀️ Gym Management API running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});