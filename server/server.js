import dotenv from "dotenv"
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const path    = require('path');

const connectDB    = require('./src/config/db');
const authRoutes   = require('./src/routes/authRoutes');
const adminRoutes  = require('./src/routes/adminRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const userRoutes   = require('./src/routes/userRoutes');

dotenv.config();

const app = express();

// Connect to Mongo
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/auth',   authRoutes);
app.use('/admin',  adminRoutes);
app.use('/member', memberRoutes);
app.use('/user',   userRoutes);

// Health check route (for API only)
app.get('/api', (_req, res) => res.send('🏋️‍♀️ Gym Management API running'));

// --- Serve Frontend Build ---
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch-all → send React index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});
// ----------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
