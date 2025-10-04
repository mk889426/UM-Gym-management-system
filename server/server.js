import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import connectDB from "./src/config/db.js"

import authRoutes from "./src/routes/authRoutes.js"
import adminRoutes from "./src/routes/adminRoutes.js"
import memberRoutes from "./src/routes/memberRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"

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
