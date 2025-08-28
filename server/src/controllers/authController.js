const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const User      = require('../models/User');
const Blacklist = require('../models/Blacklist');

const SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("username, password ::",username, password)
  if (!username || !password) {
    return res.status(400).json({ msg: 'username & password required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, username: user.username, role: user.role };
    const token   = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.logout = async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(400).json({ msg: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    await Blacklist.create({ token });
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.register = async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'username & password required' });
  }

  try {
    // 1. Ensure username is unique
    if (await User.findOne({ username })) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    // 2. Hash password & create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role });

    // 3. (Optional) Auto-login: issue a JWT
    const payload = { id: user._id, username: user.username, role: user.role };
    const token   = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    // 4. Return token + user info (minus password)
    res.status(201).json({ token, user: { id: user._id, username, role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
