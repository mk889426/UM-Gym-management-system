// src/middlewares/auth.js
const jwt       = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');

const SECRET = process.env.JWT_SECRET;

// Verify JWT & check blacklist
exports.verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: 'No token provided' });

  const token = header.split(' ')[1];
  const isBlacklisted = await Blacklist.findOne({ token });
  if (isBlacklisted) return res.status(401).json({ msg: 'Token revoked' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

// Role-based guard
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Forbidden: insufficient rights' });
  }
  next();
};