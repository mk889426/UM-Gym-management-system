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
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth',   authRoutes);
app.use('/admin',  adminRoutes);
app.use('/member', memberRoutes);
app.use('/user',   userRoutes);

app.get('/', (_req, res) => res.send('🏋️‍♀️ Gym Management API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});